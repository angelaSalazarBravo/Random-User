
import { API_WORLD_TIME, API_RANDOM_USER, options } from "./apis.js";
import { parseDataToPersona } from "./util.js";




const classContainer = document.querySelector(".container");
const cardContainerDiv = document.createElement("div");
cardContainerDiv.id = "card-container";
classContainer.appendChild(cardContainerDiv);

const boton = document.createElement("button");
boton.id = "boton";
boton.innerText = "Generate User";
classContainer.appendChild(boton);

const foto = document.createElement("img");
foto.id = "foto";
foto.src = "user_nt_found.jpg";
cardContainerDiv.appendChild(foto);

const arrayKeyDefault = [
  "Name : Name Surname",
  "Email : Mail",
  "Phone : Phone",
  "City : City",
  "time : time"
];
arrayKeyDefault.forEach((item) => {
  const spanElement = document.createElement("span");
  spanElement.textContent = item;
  cardContainerDiv.appendChild(spanElement);
});

async function fetchWorldTime(city) {
  try {
    const url = `${API_WORLD_TIME}${encodeURIComponent(city)}`;
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching world time");
  }
}

async function fetchRandomUser() {
  try {
    const respuesta = await fetch(API_RANDOM_USER);
    if (respuesta.ok) {
      const datos = await respuesta.json();
      const user = datos.results[0];

      const worldTimeResult = await fetchWorldTime(user.location.city + ", " + user.location.state);
      if (worldTimeResult && worldTimeResult.datetime) {
        const { datetime } = worldTimeResult;
        const time = datetime.split(' ')[1];

        return { user, worldTimeResult, time };
      } else {
        throw new Error("Error fetching world time");
      }
    } else {
      throw new Error("Error al obtener datos de la API");
    }
  } catch (error) {
    console.error(error.message);
    throw new Error("Error fetching random user");
  }
}



boton.addEventListener("click", async () => {
  try {
    const { user, worldTimeResult } = await fetchRandomUser();
    const time = worldTimeResult.datetime.split(' ')[1];

    const persona = parseDataToPersona(user);

    cardContainerDiv.innerHTML = "";


    const imgElement = document.createElement("img");
    imgElement.src = persona.img;
    cardContainerDiv.appendChild(imgElement);


    const arrayKeys = ["img", "Name : ", "Email : ", "Phone : ", "City : "];
    Object.keys(persona).forEach((key, i) => {
      if (key !== 'img') {
        const spanElement = document.createElement("span");
        spanElement.textContent = arrayKeys[i] + persona[key];
        cardContainerDiv.appendChild(spanElement);
      }
    });

  
    const timeSpanElement = document.createElement("span");
    timeSpanElement.textContent = `Time : ${time}`;
    cardContainerDiv.appendChild(timeSpanElement);

  } catch (error) {
    console.error(error.message);
  }
});


