//set API Key
const API_KEY = "653aba30-b77e-11e8-bf0e-e9322ccde4db";

// check the state of the URL after each hash change
['DOMContentLoaded', 'hashchange'].forEach((e) => {
  window.addEventListener(e, () => {

    // if there's a # there, return the correct function
    if (window.location.hash.includes('obj')){
        document.querySelector("#object").innerHTML = "";
        showObjectList(window.location.hash.slice(12));
    }
    else if (window.location.hash.includes('gal')){
      document.querySelector("#objects").innerHTML = "";
      showObjectsTable(window.location.hash.slice(4));
    }
    else {
      const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
      showGalleries(url);
    }
  });
});

function showGalleries(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
      data.records.forEach(gallery => {
        document.querySelector("#galleries").innerHTML += `
          <li>
            <a href="#gal${gallery.id}">
              Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
            </a>
          </li>
        `;
      });
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
      // check if people array exists or is empty
      if (object.people === undefined || object.people.length == 0) {
        document.querySelector("#objects").innerHTML += `
      <th><a href="#gal${galleryURL.slice(49,53)}/obj${object.objectnumber}">${object.title} </th>
      <th><img src="${object.primaryimageurl}" alt="Picture of ${object.title}" style="width:100px;"></th>
      <th>None Listed</th>
      <th><a href="${object.url}"> More Info</th>
      `;
    }
      else {
      document.querySelector("#objects").innerHTML += `
      <th><a href="#gal${galleryURL.slice(49,53)}/obj${object.objectnumber}">${object.title} </th>
      <th><img src="${object.primaryimageurl}" alt="Picture of ${object.title}" style="width:100px;"></th>
      <th>${object.people[0].name}</th>
      <th><a href="${object.url}"> More Info</th>
      `;
      }
    });
    if (data.info.next) {
      showObjects(data.info.next);
    }
  })
}

function showIndividualObject (objectURL) {
  fetch(objectURL)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(object => {
      //set null values to none or n/a
      if (object.description === null) {
        object.description = "None";
      }
      if (object.provenance === null) {
        object.provenance = "N/A"
      }
      if (object.accessionyear === null) {
        object.accessionyear = "N/A"
      }
    document.querySelector("#object").innerHTML += `
    <th>${object.title}</th>
    <th>${object.title}</th> 
    <th>${object.provenance}</th> 
    <th>${object.accessionyear}</th> 
    <th><img src="${object.primaryimageurl}" alt="Picture of ${object.title}" style="width:500px;"></th>
    `;
    });
  })
}

function showObjectsTable(id) {
  //set correct view
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-details").style.display = "none";

  //show objects in gallery
  galleryURL = `https://api.harvardartmuseums.org/object?gallery=${id}&apikey=${API_KEY}`;
  showObjects(galleryURL);
}

function showObjectList(id) {
  //set correct view
  document.querySelector("#object-details").style.display = "block";
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "none";
  
  //show specific object
  objectURL = `https://api.harvardartmuseums.org/object?objectnumber=${id}&apikey=${API_KEY}`;
  showIndividualObject(objectURL);
}

function goBackGallery() {
  //set correct view
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "block";
  document.querySelector("#object-details").style.display = "none";

  //remove string after hash
  removeHash();

  //show galleries
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  showGalleries(url);
}

//remove string after hash
function removeHash () { 
  history.pushState("", document.title, window.location.pathname + window.location.search);
}

function goBackObjects() {
  //display objects in specified gallery
  id = window.location.hash.slice(4,8)
  window.location.hash = "gal" + id
}


