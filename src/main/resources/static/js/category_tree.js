document.addEventListener("DOMContentLoaded", function() {
    const categoryHeaders = document.querySelectorAll(".category-header");
  
    categoryHeaders.forEach(function(header) {
      header.addEventListener("click", function() {
        this.parentElement.classList.toggle("open");
      });
    });
  });
  