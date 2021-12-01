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
    var competitorImageContainer = document.getElementById('competitor-image-container'); //////////////////////
    // Functions
    //////////////////////
    //==// function to put imported image in DOM //==//

    function putImageInDom() {
      var bottleImageDataUrl = localStorage.getItem('bottle-image');

      if (bottleImageDataUrl) {
        //check if an image exists within localStorage
        sectionUpload.innerHTML = ''; //clear current image in the DOM

        var imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate template

        sectionUpload.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
      }
    }

    function updateCompetitorImage() {
      var bottleImageDataUrl = localStorage.getItem('bottle-image'); //get the image from localStorage 

      bottleImageDataUrl = Buffer.from(bottleImageDataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64'); // turn image into binary format for Jimp to read

      Jimp.read(bottleImageDataUrl) //use a Jimp function constructor and pass in Base64URL
      .then(function (newImage) {
        // call promise and pass in newImage as anonymous function
        newImage.rotate(180) // rotate image
        .getBase64(Jimp.MIME_PNG, function (err, src) {
          //change image to PNG and convert to Base64URL
          localStorage.setItem("competitor-image", src); // set item in local storage

          var imagePreviewElement = bottlePreviewTemplate('uploaded bottle', src); //call function to populate template

          competitorImageContainer.innerHTML = ''; //clear container for image

          competitorImageContainer.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
        });
      })["catch"](function (err) {
        // catch errors that occur
        console.error(err); //print error to the console
      });
      console.log('updated competitor image');
    } //////////////////////
    // Event listeners
    //////////////////////


    document.addEventListener("DOMContentLoaded", putImageInDom);
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

        putImageInDom(); // put image into the DOM with function

        updateCompetitorImage(); // update competitor image within the DOM with new image
      });
    });

})();
//# sourceMappingURL=script.js.map
