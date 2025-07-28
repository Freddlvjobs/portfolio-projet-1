document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // =============== MENU HAMBURGER MOBILE ================
    // ======================================================
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Change icon bars to X and back
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Fermer le menu en cliquant sur un lien (pour single page)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });


    // ======================================================
    // =============== SLIDER DE TÉMOIGNAGES ================
    // ======================================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.testimonial-nav .next');
    const prevBtn = document.querySelector('.testimonial-nav .prev');
    const dotsContainer = document.querySelector('.testimonial-dots');

    let currentSlide = 0;

    if (slides.length > 0) {
        // Créer les points de navigation
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.testimonial-dots .dot');

        const goToSlide = (n) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });

        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });

        // Défilement automatique
        setInterval(() => {
             goToSlide(currentSlide + 1);
        }, 7000); // Change de slide toutes les 7 secondes
    }

    // ======================================================
    // ================= ACCORDÉON FAQ ======================
    // ======================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Fermer tous les autres accordéons
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Ouvrir celui qui est cliqué (s'il était fermé)
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ======================================================
    // ============= ANIMATIONS AU SCROLL ===================
    // ======================================================
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    // Pour une meilleure performance, on peut utiliser IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        scrollElements.forEach(el => observer.observe(el));
    } else {
        // Fallback pour les anciens navigateurs
        window.addEventListener('scroll', handleScrollAnimation);
        handleScrollAnimation(); // Affiche les éléments déjà visibles au chargement
    }

    // ======================================================
    // =============== VALIDATION FORMULAIRE ================
    // ======================================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formStatus = document.getElementById('form-status');
            formStatus.innerHTML = '';
            formStatus.className = '';

            // Reset all errors
            const errorMessages = this.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.style.display = 'none';
                msg.parentElement.classList.remove('error');
            });

            // Champs à valider
            const name = this.querySelector('#name');
            const email = this.querySelector('#email');
            const subject = this.querySelector('#subject');
            const message = this.querySelector('#message');
            const rgpd = this.querySelector('#rgpd');

            // Validation du nom
            if (name.value.trim() === '') {
                showError(name, 'Veuillez entrer votre nom.');
                isValid = false;
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Veuillez entrer une adresse email valide.');
                isValid = false;
            }

            // Validation du sujet
            if (subject.value === '') {
                showError(subject, 'Veuillez choisir un sujet.');
                isValid = false;
            }

            // Validation du message
            if (message.value.trim().length < 10) {
                showError(message, 'Votre message doit contenir au moins 10 caractères.');
                isValid = false;
            }
            
            // Validation de la checkbox RGPD
            if (!rgpd.checked) {
                 showError(rgpd, 'Veuillez accepter les conditions pour continuer.');
                 isValid = false;
            }

            if (isValid) {
                // Simulation de l'envoi du formulaire
                formStatus.classList.add('success');
                formStatus.textContent = 'Merci ! Votre message a bien été envoyé. Je vous recontacterai prochainement.';
                contactForm.reset();
                
                // Cacher le message de succès après 5 secondes
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = '';
                }, 5000);
                
            } else {
                formStatus.classList.add('error');
                formStatus.textContent = 'Oups ! Il y a des erreurs dans le formulaire. Veuillez vérifier les champs en rouge.';
            }
        });
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.closest('.form-group-checkbox');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

});
