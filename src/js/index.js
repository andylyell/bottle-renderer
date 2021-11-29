"use strict";
console.log('it worked');

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

    // console.log(typeof bottleImageDataUrl === 'boolean');

    if(bottleImageDataUrl) {
        const imagePreviewElement = document.createElement("img");
        imagePreviewElement.setAttribute("alt", "uploaded bottle");
        imagePreviewElement.setAttribute("src", bottleImageDataUrl);
        imagePreviewElement.classList.add('image-preview')
        sectionUpload.appendChild(imagePreviewElement);
    };
};

//////////////////////
// Event listeners
//////////////////////
document.addEventListener("DOMContentLoaded", putImageInDom);
fileInput.addEventListener("change", (e) => { //select file input button
    
    // console.log(e.target.files); //print obj to console

    const reader = new FileReader(); //create new reader instance to convert to data url
    reader.readAsDataURL(e.target.files[0]); //pass file into reader

    reader.addEventListener("load", () => { //add event listener to the load event
        localStorage.setItem("bottle-image", reader.result);
        putImageInDom();
    });

});

