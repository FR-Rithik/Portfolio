document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.display = 'none';
    });

    // Typing effect
    new Typed('.typing', {
        strings: ["Backend Developer", "API Engineer", "C++ Systems Builder"],
        typeSpeed: 90,
        backSpeed: 55,
        loop: true
    });

    // Nav hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Animate on scroll
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observerInstance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach(el => observer.observe(el));
});
