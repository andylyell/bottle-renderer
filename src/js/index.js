"use strict";

//////////////////////
// Imports
//////////////////////
import { bottlePreviewTemplate } from './templates/bottlePreview.js';

//////////////////////
// DOM Elements
//////////////////////
const fileInput = document.getElementById('fileInput');
const sectionUpload = document.getElementById('section-upload');
const competitorImageContainer = document.getElementById('competitor-image-container');

//////////////////////
// Functions
//////////////////////

//==// function to put a single image in the DOM //==//
function putImageInDom(imageName, imageLocation) {
    const bottleImageDataUrl = localStorage.getItem(imageName);
    if(bottleImageDataUrl) { //check if an image exists within localStorage
        imageLocation.innerHTML = ''; //clear current image in the DOM
        const imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate template
        imageLocation.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
    };
};

//==// function to put multiple in DOM //==//
function placeImagesInDom(images) { //get array of multiple image objects
    images.forEach(function(image) {
        const {imageName, imageLocation} = image; //destructure object
        const bottleImageDataUrl = localStorage.getItem(imageName); // get image from local storage that matches image array
        if(bottleImageDataUrl) { //check if an image exists within localStorage
            const imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate image template
            imageLocation.innerHTML = ''; //clear current image in the DOM
            imageLocation.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
        };
        return;
    })
};

//==// function to create competitor image and place within DOM //==//
function updateCompetitorImage() { 
    let bottleImageDataUrl = localStorage.getItem('bottle-image'); //get the image from localStorage 
    bottleImageDataUrl = Buffer.from(bottleImageDataUrl.replace(/^data:image\/\w+;base64,/, ""),'base64'); // turn image into binary format for Jimp to read

    const bottleImage = Jimp.read(bottleImageDataUrl) //use a Jimp function constructor and pass in Base64URL
        .then(function(newImage) { // call promise and pass in newImage as anonymous function
            return newImage; // promise returns image when handled
        })
        .catch(function(err) { // catch errors that occur
            console.error(err); //print error to the console
        });

    const backgroundImage = Jimp.read('images/background.png')
        .then(function(backgroundImageData) {
            return backgroundImageData; // promoise returns image when handled
        })
        .catch(function(err) {
            console.error(err);
        })
    
    const combinedImage = Promise.all([bottleImage, backgroundImage]); //promise.all to resolve all promises to use data from multiple images

    combinedImage
        .then(function(data) { //thenable on promise to check if resolved or rejects
            data[1] // access the backgroundImage
                .composite(data[0], 0 ,0) // place bottle image on top at location x and y
                .getBase64(Jimp.MIME_PNG, function(err, src) { // convert to Base64URL string
                    // console.log(src); // print to console
                    localStorage.setItem("competitor-image-combined", src); // set item in local storage
                    competitorImageContainer.innerHTML = ''; //clear container for image
                    const imagePreviewElement = bottlePreviewTemplate('uploaded bottle', src); //call function to populate template
                    competitorImageContainer.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
                });
        })
        .catch(function(err){
            console.error(err);
        })        

}

//////////////////////
// Event listeners
//////////////////////
document.addEventListener("DOMContentLoaded", function(){
    const imagesToUpdate = [
        {
            imageName: 'bottle-image',
            imageLocation: sectionUpload
        },
        {
            imageName: 'competitor-image-combined',
            imageLocation: competitorImageContainer
        },
    ]
    placeImagesInDom(imagesToUpdate);
});
fileInput.addEventListener("change", (e) => { //select file input button and pass in click event
    if (localStorage.getItem('bottle-image')) { // guard clause check if there is image data within local storage
        localStorage.setItem("bottle-image", ''); //clear localStorage for bottle image
    }
    const reader = new FileReader(); //create new reader instance to convert to data url
    reader.readAsDataURL(e.target.files[0]); //pass file into reader to convert to Data Url
    reader.addEventListener("load", () => { //add event listener to the load event
        localStorage.setItem("bottle-image", reader.result); //set local storage with result from reader instance
        updateCompetitorImage(); // update competitor image within the DOM with new image
        const imagesToUpdate = [
            {
                imageName: 'bottle-image',
                imageLocation: sectionUpload
            },
            {
                imageName: 'competitor-image-combined',
                imageLocation: competitorImageContainer
            },
        ]
        placeImagesInDom(imagesToUpdate);

    });
});

