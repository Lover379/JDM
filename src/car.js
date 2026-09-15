import { cars } from "./cars.js";

const params = new URLSearchParams(window.location.search);
const carId = params.get("car");
const car = cars.find((item) => item.id === carId);

const setText = (id, value) => {
  const element = document.querySelector(id);
  if (element) element.textContent = value || "—";
};

if (!car) {
  document.querySelector(".car-page").innerHTML = `
    <div class="car-not-found">
      <h1>CAR NOT FOUND</h1>
      <a href="/">← Вернуться в каталог</a>
    </div>
  `;
} else {
  document.title = `${car.fullName} — JDM`;

  setText("#car-brand", car.brand);
  setText("#car-name", car.name);
  setText("#car-year", car.year);

  setText("#car-manufacturer", car.manufacturer);
  setText("#car-country", car.country);
  setText("#car-production", car.production);
  setText("#car-body", car.body);
  setText("#car-platform", car.platform);

  setText("#car-description", car.description);
  setText("#car-history", car.history);
  setText("#car-generations", car.generations);

  setText("#car-engine", car.engine);
  setText("#car-volume", car.volume);
  setText("#car-cylinders", car.cylinders);
  setText("#car-power", car.power);
  setText("#car-torque", car.torque);
  setText("#car-fuel", car.fuel);

  setText("#car-drive", car.drive);
  setText("#car-transmission", car.transmission);

  setText("#car-length", car.length);
  setText("#car-width", car.width);
  setText("#car-height", car.height);
  setText("#car-wheelbase", car.wheelbase);
  setText("#car-weight", car.weight);

  setText("#car-acceleration", car.acceleration);
  setText("#car-top-speed", car.topSpeed);

  const image = document.querySelector("#car-image");
  image.src = car.image;
  image.alt = car.fullName;

  const versions = document.querySelector("#car-versions");

  car.versions.forEach((version) => {
    const li = document.createElement("li");
    li.textContent = version;
    versions.appendChild(li);
  });

  const facts = document.querySelector("#car-facts");

  car.facts.forEach((fact) => {
    const li = document.createElement("li");
    li.textContent = fact;
    facts.appendChild(li);
  });
}