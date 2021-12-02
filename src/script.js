(function () {
    'use strict';

    function bottlePreviewTemplate(altText, imageData) {
      var template = "\n    <img alt=\"".concat(altText, "\" src=\"").concat(imageData, "\" class=\"image-preview\"> \n    ");
      return template;
    }

    // DOM Elements
    //////////////////////

    var fileInput = document.getElementById('fileInput');
    var sectionUpload = document.getElementById('section-upload');
    var competitorImageContainer = document.getElementById('competitor-image-container');
    var spinner = "\n    <div class=\"loading-spinner\">\n        <div class=\"loading-spinner__spinner\"></div>\n    </div>"; //////////////////////

    function placeImagesInDom(images) {
      //get array of multiple image objects
      images.forEach(function (image) {
        var imageName = image.imageName,
            imageLocation = image.imageLocation; //destructure object

        var bottleImageDataUrl = localStorage.getItem(imageName); // get image from local storage that matches image array

        if (bottleImageDataUrl) {
          //check if an image exists within localStorage
          var imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate image template

          imageLocation.innerHTML = ''; //clear current image in the DOM

          imageLocation.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
        }
        return;
      });
    }

    function updateCompetitorImage() {
      var bottleImageDataUrl = localStorage.getItem('bottle-image'); //get the image from localStorage 

      bottleImageDataUrl = Buffer.from(bottleImageDataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64'); // turn image into binary format for Jimp to read

      var bottleImage = Jimp.read(bottleImageDataUrl) //use a Jimp function constructor and pass in Base64URL
      .then(function (newImage) {
        // call promise and pass in newImage as anonymous function
        competitorImageContainer.insertAdjacentHTML('afterbegin', spinner); //insert loading spinner into the DOM whilst updating

        return newImage; // promise returns image when handled
      })["catch"](function (err) {
        // catch errors that occur
        console.error(err); //print error to the console
      });
      var backgroundImage = Jimp.read('images/background.png').then(function (backgroundImageData) {
        return backgroundImageData; // promoise returns image when handled
      })["catch"](function (err) {
        console.error(err);
      });
      var combinedImage = Promise.all([bottleImage, backgroundImage]); //promise.all to resolve all promises to use data from multiple images

      combinedImage.then(function (data) {
        //thenable on promise to check if resolved or rejects
        console.log(data[1]);
        data[1] // access the backgroundImage

        /**
         * data[1].bitmap.width is the width of the background image
         * date[0].bitmap.width is the width of the bottle image
         * 
         * the width of the background / 2 - the width of the bottle / 2
         */
        .composite(data[0], data[1].bitmap.width / 2 - data[0].bitmap.width / 2, 1260) // place bottle image on top at location x and y
        .getBase64(Jimp.MIME_PNG, function (err, src) {
          // convert to Base64URL string
          localStorage.setItem("competitor-image-combined", src); // set item in local storage

          competitorImageContainer.innerHTML = ''; //clear container for image

          var imagePreviewElement = bottlePreviewTemplate('uploaded bottle', src); //call function to populate template

          competitorImageContainer.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
        });
      })["catch"](function (err) {
        console.error(err);
      });
    } //////////////////////
    // Event listeners
    //////////////////////


    document.addEventListener("DOMContentLoaded", function () {
      var imagesToUpdate = [{
        imageName: 'bottle-image',
        imageLocation: sectionUpload
      }, {
        imageName: 'competitor-image-combined',
        imageLocation: competitorImageContainer
      }];
      placeImagesInDom(imagesToUpdate);
    });
    fileInput.addEventListener("change", function (e) {
      //select file input button and pass in click event
      if (localStorage.getItem('bottle-image')) {
        // guard clause check if there is image data within local storage
        localStorage.setItem("bottle-image", ''); //clear localStorage for bottle image
      }

      var reader = new FileReader(); //create new reader instance to convert to data url

      reader.readAsDataURL(e.target.files[0]); //pass file into reader to convert to Data Url

      reader.addEventListener("load", function () {
        //add event listener to the load event
        localStorage.setItem("bottle-image", reader.result); //set local storage with result from reader instance

        updateCompetitorImage(); // update competitor image within the DOM with new image

        var imagesToUpdate = [{
          imageName: 'bottle-image',
          imageLocation: sectionUpload
        }, {
          imageName: 'competitor-image-combined',
          imageLocation: competitorImageContainer
        }];
        placeImagesInDom(imagesToUpdate);
      });
    });

})();
//# sourceMappingURL=script.js.map
