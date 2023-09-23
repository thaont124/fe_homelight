const domain="http://26.127.173.194:8080"

window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    if (window.scrollY > 0) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
});
