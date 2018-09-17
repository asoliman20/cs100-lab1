const API_KEY = "653aba30-b77e-11e8-bf0e-e9322ccde4db";
let galleryNumber;
document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  showGalleries(url);
});

function showGalleries(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(gallery => {
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
    });
    console.log(galleryNumber)
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showObjects (galleryURL) {
  fetch(galleryURL)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(object => {
      document.querySelector("#objects").innerHTML += `
      <th><a href="#${object.id}" onclick="showObjectsTable(${object.id})">${object.title} </th>
      <th><img src="${object.primaryimageurl}" alt="Picture of ${object.title}" style="width:100px;"></th>
      <th>${object.name}</th>
      <th>${object.url}</th>
      `;
    });
    if (data.info.next) {
      showObjects(data.info.next);
    }
  })
}

function showObjectsTable(id) {
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
}

window.onload=function(){
  // listen for click
  const galleryElement = document.querySelector("#galleries");
  galleryElement.addEventListener("click", () => {
    galleryNumber = window.location.hash;
    galleryURL = `https://api.harvardartmuseums.org/object?gallery=${galleryNumber}&apikey=${API_KEY}`;
    console.log(galleryURL);
    showObjects(galleryURL);
  });
}