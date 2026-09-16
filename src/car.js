import { cars } from "./cars.js";

const params = new URLSearchParams(window.location.search);
const carId = params.get("car");

// =========================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =========================================================

const setText = (selector, value) => {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent =
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
        ? value
        : "—";
  }
};

const setImage = (selector, src, alt) => {
  const image = document.querySelector(selector);

  if (!image) {
    return;
  }

  if (src) {
    image.src = src;
    image.alt = alt || "JDM автомобиль";

    image.onerror = () => {
      image.removeAttribute("src");
      image.alt = "Изображение отсутствует";
    };
  } else {
    image.removeAttribute("src");
    image.alt = "Изображение отсутствует";
  }
};

// =========================================================
// ПОИСК МАШИНЫ
// =========================================================

let car = null;
let isGarageCar = false;

// Сначала ищем в обычном каталоге
if (carId) {
  car = cars.find((item) => item.id === carId);
}

// Если в каталоге нет — ищем в гараже
if (!car && carId) {
  try {
    const garageCars =
      JSON.parse(localStorage.getItem("jdmGarage")) || [];

    const garageCar = garageCars.find(
      (item) => item.id === carId
    );

    if (garageCar) {
      car = garageCar;
      isGarageCar = true;
    }
  } catch (error) {
    console.error(
      "Ошибка загрузки машин из гаража:",
      error
    );
  }
}

// =========================================================
// МАШИНА НЕ НАЙДЕНА
// =========================================================

if (!car) {
  const page = document.querySelector(".car-page");

  if (page) {
    page.innerHTML = `
      <div class="car-not-found">

        <h1>CAR NOT FOUND</h1>

        <p>
          Автомобиль не найден в каталоге или гараже.
        </p>

        <a href="./">
          ← ВЕРНУТЬСЯ В КАТАЛОГ
        </a>

      </div>
    `;
  }

} else {

  // =======================================================
  // TITLE
  // =======================================================

  const carFullName =
    car.fullName ||
    `${car.brand || ""} ${car.name || ""}`.trim();

  document.title = `${carFullName || "Автомобиль"} — JDM`;


  // =======================================================
  // ОСНОВНАЯ ИНФОРМАЦИЯ
  // =======================================================

  setText("#car-brand", car.brand);
  setText("#car-name", car.name);
  setText("#car-year", car.year);


  // =======================================================
  // ОБЩАЯ ИНФОРМАЦИЯ
  // =======================================================

  setText(
    "#car-manufacturer",
    car.manufacturer || car.brand
  );

  setText("#car-country", car.country);
  setText("#car-production", car.production || car.year);
  setText("#car-body", car.body);
  setText("#car-platform", car.platform);


  // =======================================================
  // ОПИСАНИЕ
  // =======================================================

  setText("#car-description", car.description);
  setText("#car-history", car.history);
  setText("#car-generations", car.generations);


  // =======================================================
  // ДВИГАТЕЛЬ
  // =======================================================

  setText("#car-engine", car.engine);
  setText("#car-volume", car.volume);
  setText("#car-cylinders", car.cylinders);
  setText("#car-power", car.power);
  setText("#car-torque", car.torque);
  setText("#car-fuel", car.fuel);


  // =======================================================
  // ТРАНСМИССИЯ
  // =======================================================

  setText("#car-drive", car.drive);
  setText("#car-transmission", car.transmission);


  // =======================================================
  // РАЗМЕРЫ
  // =======================================================

  setText("#car-length", car.length);
  setText("#car-width", car.width);
  setText("#car-height", car.height);
  setText("#car-wheelbase", car.wheelbase);
  setText("#car-weight", car.weight);


  // =======================================================
  // ДИНАМИКА
  // =======================================================

  setText("#car-acceleration", car.acceleration);
  setText("#car-top-speed", car.topSpeed);


  // =======================================================
  // ФОТО
  // =======================================================

  setImage(
    "#car-image",
    car.image,
    carFullName
  );


  // =======================================================
  // ВЕРСИИ
  // =======================================================

  const versions =
    document.querySelector("#car-versions");

  if (versions) {

    versions.innerHTML = "";

    if (
      Array.isArray(car.versions) &&
      car.versions.length > 0
    ) {

      car.versions.forEach((version) => {

        if (!version) {
          return;
        }

        const li =
          document.createElement("li");

        li.textContent = version;

        versions.appendChild(li);

      });

    } else {

      versions.innerHTML =
        "<li>Информация не указана</li>";

    }
  }


  // =======================================================
  // ФАКТЫ
  // =======================================================

  const facts =
    document.querySelector("#car-facts");

  if (facts) {

    facts.innerHTML = "";

    if (
      Array.isArray(car.facts) &&
      car.facts.length > 0
    ) {

      car.facts.forEach((fact) => {

        if (!fact) {
          return;
        }

        const li =
          document.createElement("li");

        li.textContent = fact;

        facts.appendChild(li);

      });

    } else {

      facts.innerHTML =
        "<li>Информация не указана</li>";

    }
  }


  // =======================================================
  // МАШИНА ИЗ МОЕГО ГАРАЖА
  // =======================================================

  if (isGarageCar) {

    const carTitle =
      document.querySelector(".car-title");

    if (carTitle) {

      const actions =
        document.createElement("div");

      actions.className =
        "car-garage-actions";

      actions.innerHTML = `
        <button
          type="button"
          class="garage-delete-page-button"
          id="delete-garage-car"
        >
          УДАЛИТЬ МАШИНУ
        </button>
      `;

      carTitle.appendChild(actions);


      // ===================================================
      // УДАЛЕНИЕ
      // ===================================================

      const deleteButton =
        document.querySelector(
          "#delete-garage-car"
        );

      if (deleteButton) {

        deleteButton.addEventListener(
          "click",
          () => {

            const confirmed = confirm(
              `Удалить "${carFullName}" из гаража?`
            );

            if (!confirmed) {
              return;
            }

            try {

              const garageCars =
                JSON.parse(
                  localStorage.getItem("jdmGarage")
                ) || [];

              const updatedCars =
                garageCars.filter(
                  (item) => item.id !== car.id
                );

              localStorage.setItem(
                "jdmGarage",
                JSON.stringify(updatedCars)
              );

              window.location.href =
                "./garage.html";

            } catch (error) {

              console.error(
                "Ошибка удаления машины:",
                error
              );

              alert(
                "Не удалось удалить автомобиль."
              );

            }

          }
        );

      }

    }

  }

}