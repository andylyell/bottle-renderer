"use strict";

//////////////////////
// Imports
//////////////////////
import { bottlePreviewTemplate } from './templates/bottlePreview.js';

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

function putImageInDom() { //function to put imported image in DOM

    // console.log("put image in the DOM");
    const bottleImageDataUrl = localStorage.getItem('bottle-image');

    if(bottleImageDataUrl) { //check if an image exists within localStorage

        sectionUpload.innerHTML = ''; //clear current image in the DOM

        const imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate template

        sectionUpload.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM

    };
};

async function updateCompetitorImage() { //function to create competitor image and place within DOM

    console.log('update competitor image');

    let bottleImageDataUrl = localStorage.getItem('bottle-image');
    // bottleImageDataUrl = Buffer.from(bottleImageDataUrl, 'base64');
    // console.log(bottleImageDataUrl);
    const newImage = await Jimp.read(Buffer.from(bottleImageDataUrl, 'base64'));
    console.log(newImage);

    await newImage.rotate(180);
    await newImage.writeAsync(`${Date.now()}-rotatedImage.png`);


    //get imported image
    // let bottleImage = await Jimp.read(bottleImageDataUrl);

    // console.log(Jimp);
    // console.log(bottleImage);

    //get background
    // const image = await Jimp.read('./images/background.png');

    //position import image on background and create
    // bottleImage = await bottleImage 
    //     image.composite(bottleImage, 0,0, {
    //         mode: Jimp.BLEND_SOURCE_OVER,
    //         opacityDest: 1,
    //         opacitySource: 0.5
    //     })

    // create new competitor image in local storage
    // await bottleImage.writeAsync(`newImage.png`);

    //place new image in the DOM
    
}

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
        updateCompetitorImage();
    });

});

