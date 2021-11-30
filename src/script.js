(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function bottlePreviewTemplate(altText, imageData) {
    var template = "\n    <img alt=\"".concat(altText, "\" src=\"").concat(imageData, "\" class=\"image-preview\"> \n    ");
    return template;
  }

  // DOM Elements
  //////////////////////
  // get file 

  var fileInput = document.getElementById('fileInput');
  var sectionUpload = document.getElementById('section-upload');
  var sectionCompetitor = document.getElementById('section-line-up'); // const imagePreview = document.getElementById('imagePreview');
  //////////////////////
  // Functions
  //////////////////////

  function putImageInDom() {
    //function to put imported image in DOM
    // console.log("put image in the DOM");
    var bottleImageDataUrl = localStorage.getItem('bottle-image');

    if (bottleImageDataUrl) {
      //check if an image exists within localStorage
      sectionUpload.innerHTML = ''; //clear current image in the DOM

      var imagePreviewElement = bottlePreviewTemplate('uploaded bottle', bottleImageDataUrl); //call function to populate template

      sectionUpload.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
    }
  }

  function updateCompetitorImage() {
    return _updateCompetitorImage.apply(this, arguments);
  } //////////////////////
  // Event listeners
  //////////////////////


  function _updateCompetitorImage() {
    _updateCompetitorImage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var bottleImageDataUrl, newImage;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //function to create competitor image and place within DOM
              console.log('update competitor image');
              bottleImageDataUrl = localStorage.getItem('bottle-image'); //get the image from localStorage 

              bottleImageDataUrl = Buffer.from(bottleImageDataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64'); // turn image into binary format for Jimp to read

              _context.next = 5;
              return Jimp.read(Buffer.from(bottleImageDataUrl, 'base64'));

            case 5:
              newImage = _context.sent;
              _context.next = 8;
              return newImage.rotate(180);

            case 8:
              _context.next = 10;
              return newImage.getBase64(jimp.MIME_PNG, function (err, src) {
                console.log(src);
                localStorage.setItem("competitor-image", src);
                var imagePreviewElement = bottlePreviewTemplate('uploaded bottle', src); //call function to populate template

                //call function to populate template
                sectionCompetitor.insertAdjacentHTML('beforeend', imagePreviewElement); //insert into the DOM
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _updateCompetitorImage.apply(this, arguments);
  }

  document.addEventListener("DOMContentLoaded", putImageInDom);
  fileInput.addEventListener("change", function (e) {
    //select file input button
    if (localStorage.getItem('bottle-image')) {
      // check if there is image data within local storage
      localStorage.setItem("bottle-image", ''); //clear localStorage
    } else {
      console.log('nothing there');
    }

    var reader = new FileReader(); //create new reader instance to convert to data url

    reader.readAsDataURL(e.target.files[0]); //pass file into reader

    reader.addEventListener("load", function () {
      //add event listener to the load event
      localStorage.setItem("bottle-image", reader.result);
      putImageInDom();
      updateCompetitorImage();
    });
  });

})();
//# sourceMappingURL=script.js.map
