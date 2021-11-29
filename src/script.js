(function () {
    'use strict';

    console.log('it worked'); //////////////////////
    // DOM Elements
    //////////////////////
    // get file 

    var fileInput = document.getElementById('fileInput');
    var sectionUpload = document.getElementById('section-upload'); // const imagePreview = document.getElementById('imagePreview');
    //////////////////////
    // Functions
    //////////////////////

    function putImageInDom() {
      // console.log("put image in the DOM");
      var bottleImageDataUrl = localStorage.getItem('bottle-image'); // console.log(typeof bottleImageDataUrl === 'boolean');

      if (bottleImageDataUrl) {
        var imagePreviewElement = document.createElement("img");
        imagePreviewElement.setAttribute("alt", "uploaded bottle");
        imagePreviewElement.setAttribute("src", bottleImageDataUrl);
        imagePreviewElement.classList.add('image-preview');
        sectionUpload.appendChild(imagePreviewElement);
      }
    }
    // Event listeners
    //////////////////////

    document.addEventListener("DOMContentLoaded", putImageInDom);
    fileInput.addEventListener("change", function (e) {
      //select file input button
      // console.log(e.target.files); //print obj to console
      var reader = new FileReader(); //create new reader instance to convert to data url

      reader.readAsDataURL(e.target.files[0]); //pass file into reader

      reader.addEventListener("load", function () {
        //add event listener to the load event
        localStorage.setItem("bottle-image", reader.result);
        putImageInDom();
      });
    });

})();
//# sourceMappingURL=script.js.map
