const STORAGE_KEY = "jdmGarage";

// =========================================================
// ELEMENTS
// =========================================================

const addButton = document.querySelector("#add-car-button");
const emptyAddButton = document.querySelector("#empty-add-button");

const formBlock = document.querySelector("#garage-form");
const closeFormButton = document.querySelector("#close-form");
const cancelButton = document.querySelector("#cancel-car");

const carForm = document.querySelector("#car-form");

const photoInput = document.querySelector("#car-photo");
const photoPreview = document.querySelector("#photo-preview");
const photoPlaceholder = document.querySelector("#photo-placeholder");

const garageGrid = document.querySelector("#garage-grid");
const garageEmpty = document.querySelector("#garage-empty");
const garageCount = document.querySelector("#garage-count");

// =========================================================
// EDIT STATE
// =========================================================

let editingCarId = null;
let selectedImage = "";

// =========================================================
// STORAGE
// =========================================================

function getGarageCars() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Ошибка загрузки гаража:", error);
    return [];
  }
}

function saveGarageCars(cars) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =========================================================
// CREATE ID
// =========================================================

function createId(brand, model) {
  const random =
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 7);

  const base = `${brand}-${model}`
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-|-$/g, "");

  return `garage-${base}-${random}`;
}

// =========================================================
// FORM
// =========================================================

function openForm() {
  formBlock.hidden = false;

  formBlock.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function closeForm() {
  editingCarId = null;

  formBlock.hidden = true;

  carForm.reset();

  selectedImage = "";

  photoPreview.removeAttribute("src");
  photoPreview.style.display = "none";

  photoPlaceholder.style.display = "flex";

  document.querySelector("#car-country").value = "Япония";

  // Возвращаем обычный заголовок
  const formTitle = formBlock.querySelector(".garage-form-header h2");

  if (formTitle) {
    formTitle.textContent = "ДОБАВИТЬ МАШИНУ";
  }
}

// =========================================================
// GET FORM VALUE
// =========================================================

function getValue(selector) {
  const element = document.querySelector(selector);

  return element ? element.value.trim() : "";
}

// =========================================================
// SET FORM VALUE
// =========================================================

function setValue(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.value = value || "";
  }
}

// =========================================================
// OPEN EDIT FORM
// =========================================================

function editCar(carId) {
  const garageCars = getGarageCars();

  const car = garageCars.find(
    (item) => String(item.id) === String(carId)
  );

  if (!car) {
    alert("Автомобиль не найден.");
    return;
  }

  editingCarId = car.id;

  // -------------------------
  // Заполняем форму
  // -------------------------

  setValue("#car-brand", car.brand);
  setValue("#car-model", car.model || car.name);
  setValue("#car-version", car.version || "");
  setValue("#car-year", car.year);
  setValue("#car-country", car.country || "Япония");
  setValue("#car-body", car.body);
  setValue("#car-engine", car.engine);
  setValue("#car-volume", car.volume);
  setValue("#car-power", car.power);
  setValue("#car-drive", car.drive);
  setValue("#car-transmission", car.transmission);
  setValue("#car-weight", car.weight);
  setValue("#car-description", car.description);

  // -------------------------
  // Фото
  // -------------------------

  selectedImage = car.image || "";

  if (selectedImage) {
    photoPreview.src = selectedImage;
    photoPreview.style.display = "block";
    photoPlaceholder.style.display = "none";
  } else {
    photoPreview.removeAttribute("src");
    photoPreview.style.display = "none";
    photoPlaceholder.style.display = "flex";
  }

  // -------------------------
  // Меняем заголовок
  // -------------------------

  const formTitle =
    formBlock.querySelector(".garage-form-header h2");

  if (formTitle) {
    formTitle.textContent = "ИЗМЕНИТЬ МАШИНУ";
  }

  openForm();
}

// =========================================================
// BUTTONS
// =========================================================

if (addButton) {
  addButton.addEventListener("click", () => {
    editingCarId = null;
    openForm();
  });
}

if (emptyAddButton) {
  emptyAddButton.addEventListener("click", () => {
    editingCarId = null;
    openForm();
  });
}

if (closeFormButton) {
  closeFormButton.addEventListener("click", closeForm);
}

if (cancelButton) {
  cancelButton.addEventListener("click", closeForm);
}

// =========================================================
// PHOTO
// =========================================================

if (photoInput) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      selectedImage = event.target.result;

      photoPreview.src = selectedImage;
      photoPreview.style.display = "block";

      photoPlaceholder.style.display = "none";
    };

    reader.readAsDataURL(file);
  });
}

// =========================================================
// FORM SUBMIT
// =========================================================

if (carForm) {
  carForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const brand = getValue("#car-brand");
    const model = getValue("#car-model");
    const version = getValue("#car-version");
    const year = getValue("#car-year");
    const country = getValue("#car-country");
    const body = getValue("#car-body");
    const engine = getValue("#car-engine");
    const volume = getValue("#car-volume");
    const power = getValue("#car-power");
    const drive = getValue("#car-drive");
    const transmission = getValue("#car-transmission");
    const weight = getValue("#car-weight");
    const description = getValue("#car-description");

    if (!brand || !model) {
      alert("Пожалуйста, укажите марку и модель.");
      return;
    }

    const garageCars = getGarageCars();

    // =======================================================
    // EDIT EXISTING CAR
    // =======================================================

    if (editingCarId) {
      const index = garageCars.findIndex(
        (item) => String(item.id) === String(editingCarId)
      );

      if (index !== -1) {
        const oldCar = garageCars[index];

        garageCars[index] = {
          ...oldCar,

          id: oldCar.id,

          isGarageCar: true,

          brand: brand.toUpperCase(),

          model: model,

          version: version,

          name: `${model}${version ? ` ${version}` : ""}`.toUpperCase(),

          fullName:
            `${brand} ${model}${version ? ` ${version}` : ""}`,

          year: year || "Не указан",

          country: country || "Япония",

          manufacturer: brand,

          production: year || "Не указан",

          body: body || "Не указан",

          platform: oldCar.platform || "Не указана",

          image: selectedImage || oldCar.image || "",

          engine: engine || "Не указан",

          volume: volume || "Не указан",

          cylinders: oldCar.cylinders || "—",

          power: power || "Не указана",

          torque: oldCar.torque || "Не указан",

          drive: drive || "Не указан",

          transmission:
            transmission || "Не указана",

          fuel: oldCar.fuel || "Бензин",

          weight: weight || "Не указана",

          length: oldCar.length || "—",

          width: oldCar.width || "—",

          height: oldCar.height || "—",

          wheelbase: oldCar.wheelbase || "—",

          topSpeed:
            oldCar.topSpeed || "Не указана",

          acceleration:
            oldCar.acceleration || "Не указана",

          description:
            description ||
            "Владелец не добавил описание автомобиля.",

          history:
            oldCar.history ||
            "Автомобиль добавлен владельцем в личный гараж.",

          generations:
            oldCar.generations ||
            "Информация не указана.",

          versions: version
            ? [version]
            : oldCar.versions || [
                "Комплектация не указана"
              ],

          facts: oldCar.facts || [
            "Автомобиль добавлен в личный гараж.",
            "Информация указана владельцем."
          ]
        };

        saveGarageCars(garageCars);

        closeForm();
        renderGarage();

        return;
      }
    }

    // =======================================================
    // CREATE NEW CAR
    // =======================================================

    const newCar = {
      id: createId(brand, model),

      isGarageCar: true,

      brand: brand.toUpperCase(),

      model: model,

      version: version,

      name:
        `${model}${version ? ` ${version}` : ""}`.toUpperCase(),

      fullName:
        `${brand} ${model}${version ? ` ${version}` : ""}`,

      year: year || "Не указан",

      country: country || "Япония",

      manufacturer: brand,

      production: year || "Не указан",

      body: body || "Не указан",

      platform: "Не указана",

      image: selectedImage || "",

      engine: engine || "Не указан",

      volume: volume || "Не указан",

      cylinders: "—",

      power: power || "Не указана",

      torque: "Не указан",

      drive: drive || "Не указан",

      transmission:
        transmission || "Не указана",

      fuel: "Бензин",

      weight: weight || "Не указана",

      length: "—",

      width: "—",

      height: "—",

      wheelbase: "—",

      topSpeed: "Не указана",

      acceleration: "Не указана",

      description:
        description ||
        "Владелец не добавил описание автомобиля.",

      history:
        "Автомобиль добавлен владельцем в личный гараж.",

      generations:
        "Информация не указана.",

      versions: version
        ? [version]
        : ["Комплектация не указана"],

      facts: [
        "Автомобиль добавлен в личный гараж.",
        "Информация указана владельцем."
      ]
    };

    garageCars.push(newCar);

    saveGarageCars(garageCars);

    closeForm();
    renderGarage();
  });
}

// =========================================================
// DELETE CAR
// =========================================================

function deleteCar(carId) {
  const garageCars = getGarageCars();

  const car = garageCars.find(
    (item) => String(item.id) === String(carId)
  );

  if (!car) {
    return;
  }

  const confirmed = confirm(
    `Удалить "${car.fullName || "автомобиль"}" из гаража?`
  );

  if (!confirmed) {
    return;
  }

  const updatedCars = garageCars.filter(
    (item) => String(item.id) !== String(carId)
  );

  saveGarageCars(updatedCars);

  renderGarage();
}

// =========================================================
// RENDER GARAGE
// =========================================================

function renderGarage() {
  const garageCars = getGarageCars();

  if (!garageGrid) {
    return;
  }

  garageGrid.innerHTML = "";

  if (garageCount) {
    garageCount.textContent =
      `${garageCars.length
        .toString()
        .padStart(2, "0")} CARS`;
  }

  if (garageCars.length === 0) {
    if (garageEmpty) {
      garageEmpty.style.display = "flex";
    }

    return;
  }

  if (garageEmpty) {
    garageEmpty.style.display = "none";
  }

  garageCars.forEach((car, index) => {
    const card = document.createElement("article");

    card.className = "car-card garage-card";

    const image = car.image
      ? `
        <img
          src="${car.image}"
          alt="${escapeHTML(
            car.fullName || `${car.brand} ${car.name}`
          )}"
        >
      `
      : `
        <div class="garage-no-image">
          NO PHOTO
        </div>
      `;

    card.innerHTML = `
      <div class="car-image">

        ${image}

        <span class="car-number">
          ${(index + 1)
            .toString()
            .padStart(2, "0")}
        </span>

      </div>

      <div class="car-info">

        <span class="car-brand">
          ${escapeHTML(car.brand)}
        </span>

        <h3>
          ${escapeHTML(car.name)}
        </h3>

        <p>
          ${escapeHTML(car.volume || "—")}
          ·
          ${escapeHTML(car.drive || "—")}
          ·
          ${escapeHTML(car.power || "—")}
        </p>

      </div>

      <div class="garage-card-actions">

        <a
          href="./car.html?car=${encodeURIComponent(car.id)}"
          class="garage-open-button"
        >
          ОТКРЫТЬ
        </a>

        <button
          type="button"
          class="garage-edit-button"
          data-id="${escapeHTML(car.id)}"
        >
          ИЗМЕНИТЬ
        </button>

        <button
          type="button"
          class="garage-delete-button"
          data-id="${escapeHTML(car.id)}"
        >
          УДАЛИТЬ
        </button>

      </div>
    `;

    garageGrid.appendChild(card);
  });

  // =======================================================
  // EDIT BUTTONS
  // =======================================================

  document
    .querySelectorAll(".garage-edit-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        editCar(button.dataset.id);
      });
    });

  // =======================================================
  // DELETE BUTTONS
  // =======================================================

  document
    .querySelectorAll(".garage-delete-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        deleteCar(button.dataset.id);
      });
    });
}

// =========================================================
// INITIAL RENDER
// =========================================================

renderGarage();