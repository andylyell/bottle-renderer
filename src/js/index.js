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
const competitorExportButton = document.getElementById('competitor-export-button');
const spinner = `
    <div class="loading-spinner">
        <div class="loading-spinner__spinner"></div>
    </div>`;

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
            competitorImageContainer.insertAdjacentHTML('afterbegin', spinner); //insert loading spinner into the DOM whilst updating
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
            console.log(data[1]);
            data[1] // access the backgroundImage

                /**
                 * data[1].bitmap.width is the width of the background image
                 * date[0].bitmap.width is the width of the bottle image
                 * 
                 * the width of the background / 2 - the width of the bottle / 2
                 */

                .composite(data[0], ((data[1].bitmap.width/2) - (data[0].bitmap.width/2)) ,1260) // place bottle image on top at location x and y
                .getBase64(Jimp.MIME_PNG, function(err, src) { // convert to Base64URL string
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

//==// Function to download a specific image from Local Storage //==//
function downloadImage() {

    console.log('Exported all images');

    //read the image from localStorage that is intended to be downloaded
    let downloadableImage = localStorage.getItem('competitor-image-combined'); //get the image from localStorage 
    downloadableImage = Buffer.from(downloadableImage.replace(/^data:image\/\w+;base64,/, ""),'base64'); // turn image into binary format for Jimp to read

    Jimp.read(downloadableImage) //use a Jimp function constructor and pass in Base64URL
        .then(function(newImage) { // call promise and pass in newImage as anonymous function

            console.log(newImage); //print Jimp object to DOM

            newImage.getBase64(Jimp.MIME_JPEG, function(err, src) {
                saveAs(src, "new-image.jpg");
            });

        })
        .catch(function(err) {
            console.log(err);
        })
        
}


//////////////////////
// Event listeners
//////////////////////
document.addEventListener('click', function(e){

    // check if competitor export button clicked
    if(e.target.id === 'competitor-export-button') {

        console.log('export competitor image');
        
    }

    // check if export all button has been clicked
    if(e.target.id === 'export-all') {

        downloadImage();

    }
    
    if(e.target.id === 'competitor-export-button') {

        downloadImage();

    }
});

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



    // let downloadElement = document.createElement('a'); //create link element needed for download
    // downloadElement.setAttribute('href', downloadableImage); // set href attribuite of the link element
    // downloadElement.setAttribute('download', 'image.jpg'); //set download attribute of the link element
    // console.log(downloadElement);
    // downloadElement.click(); // simulate the button click of the element