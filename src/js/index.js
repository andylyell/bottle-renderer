"use strict";
console.log('it worked');

//////////////////////
// Imports
//////////////////////
import {bottlePreviewTemplate} from './templates/bottlePreview.js';

//////////////////////
// DOM Elements
//////////////////////

// get file 
const fileInput = document.getElementById('fileInput');
const sectionUpload = document.getElementById('section-upload');
// const imagePreview = document.getElementById('imagePreview');


//////////////////////
// Functions
//////////////////////

function putImageInDom() {

    // console.log("put image in the DOM");
    const bottleImageDataUrl = localStorage.getItem('bottle-image');

    if(bottleImageDataUrl) { //check if an image exists within localStorage

        sectionUpload.innerHTML = ''; //clear current image in the DOM

        const imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate template

        sectionUpload.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM

    };
};

//////////////////////
// Event listeners
//////////////////////
document.addEventListener("DOMContentLoaded", putImageInDom);
fileInput.addEventListener("change", (e) => { //select file input button
    
    if (localStorage.getItem('bottle-image')) { // check if there is image data within local storage
        localStorage.setItem("bottle-image", ''); //clear localStorage
    } else {
        console.log('nothing there');
    }

    const reader = new FileReader(); //create new reader instance to convert to data url

    reader.readAsDataURL(e.target.files[0]); //pass file into reader

    reader.addEventListener("load", () => { //add event listener to the load event
        localStorage.setItem("bottle-image", reader.result);
        putImageInDom();
    });

});

