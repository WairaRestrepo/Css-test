
// URL de la API pública
const API_URL = 'https://jsonplaceholder.typicode.com';

// Headers de la solicitud
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
//div donde se renderizan los usuarios
const content = null || document.querySelector('.content');
// variable para acceder al espacio de almacenamiento local
const dataLocalStorage = window.localStorage;

/**
 * Función para realizar una solicitud a una URL dada.
 * Devuelve los datos de respuesta como JSON.
 * @param {string} urlAPI - URL a la que se realizará la solicitud.
 * @returns {Promise<object>} - Promesa que resuelve con los datos de respuesta de la solicitud como objeto JSON.
 */
async function fetchData(urlAPI) {
  try {
    // Comprobar que la URL es válida
    new URL(urlAPI);

    // Realizar la solicitud y obtener los datos de respuesta como JSON
    const response = await fetch(urlAPI, { method: 'GET', headers: REQUEST_HEADERS });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
}


//Función para obtener los datos de usuarios desde la API y devolverlos en un formato limpio.
async function getCleanUserData() {
  try {
    // Obtener los datos de usuario desde la API
    const users = await fetchData(`${API_URL}/users`);

    // Devolver los datos de usuario limpios
    return users.map(({ id, name, email, phone, website }) => ({
      id,
      name,
      email,
      phone,
      website
    }));
  } catch (error) {
    console.error(error);
    throw new Error('No se pudieron obtener los datos de usuario.');
  }
}

//Funcion para insertar los datos requeridos en LocalStorage
async function setDataLocalStorage() {
  let cleanObj = await getCleanUserData();

  cleanObj.forEach(element => {
    const id = element.id
    dataLocalStorage.setItem(id, JSON.stringify(element))
  });

}

// Obtener los datos de usuario limpios y almacenarlos en la variable dataLocalStorage
setDataLocalStorage();

//Renderizar en HTML
function rederUser() {
  // Limpiar el contenido actual
  content.innerHTML = '';

  // Obtener los usuarios del almacenamiento local y convertirlos a objetos
  const users = Object.values(dataLocalStorage).map(userString => JSON.parse(userString));

  // Ordenar los usuarios de forma ascendente por nombre
  users.sort((a, b) => a.name.localeCompare(b.name));

  // Iterar sobre los usuarios en el almacenamiento local y agregarlos al HTML
  users.forEach(user => {
    const userElement = document.createElement('div class="profile-text"');
    userElement.innerHTML = `
    <p>Nombre: ${user.name}</p>
    <p>Telefono: ${user.phone}</p>
    <p>Email: ${user.email}</p>
    <p>WebSite: ${user.website}</p>
      <button onclick="removeUser(${user.id})">Eliminar</button>
    `;
    content.appendChild(userElement);
  });
}

function removeUser(id) {
  // Eliminar el usuario del almacenamiento local
  dataLocalStorage.removeItem(id);

  // Volver a renderizar los usuarios en el HTML
  rederUser();
}

function removeUser(id) {
  //eliminar el usuario del almacenamiento local
  dataLocalStorage.removeItem(id)
  //volver a renderizar los usuarios en el HTML
  rederUser()
}
rederUser()
