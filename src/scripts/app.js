'use strict';

// Set current date for copywright
function setCopywrightYear() {
  const year = new Date().getFullYear();
  
  document
    .querySelector('.js-setYear')
    .innerHTML = year
  ;
}

function initMobileMenu () {
  $('.mobileMenu-toggle').on('click', function() {

    $('.mobileNav').toggleClass('is-active');
  });

  $(".js-mobileDropdownLink").on("click touchstart", function(e) {
    e.preventDefault();
    $(this).children(".dropdown").toggleClass("is-visible");

    $(this).find(".fa-plus").toggleClass("fa-minus");
  });
}



// Function initializer
const init = function () {
  setCopywrightYear();
  initMobileMenu();
}


// Init on DOM READY
;(function() {

  init();

})(window);
