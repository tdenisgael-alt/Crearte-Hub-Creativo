document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const revealItems = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  // --- Carrusel automático para la galería del hero ---
  const heroGallery = document.querySelector('.hero-gallery');
  if (heroGallery) {
    const prevButton = document.querySelector('.carousel-btn--prev');
    const nextButton = document.querySelector('.carousel-btn--next');
    const images = heroGallery.querySelectorAll('.hero-image');
    const totalImages = images.length;
    let currentIndex = 0;
    let intervalId;

    const showImage = (index) => {
      const scrollAmount = heroGallery.offsetWidth * index;
      const behavior = index === 0 ? 'instant' : 'smooth';
      
      heroGallery.scrollTo({
        left: scrollAmount,
        behavior: behavior,
      });
    };

    const startCarousel = () => {
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
      }, 5000); // Cambia de imagen cada 5 segundos
    };

    const resetCarousel = () => {
      clearInterval(intervalId);
      startCarousel();
    };

    if (totalImages > 1) {
      if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
          // Si estamos en la primera, vamos a la última. Si no, retrocedemos.
          currentIndex = (currentIndex - 1 + totalImages) % totalImages;
          showImage(currentIndex);
          resetCarousel();
        });

        nextButton.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % totalImages;
          showImage(currentIndex);
          resetCarousel();
        });
      }

      // Inicia el carrusel automático
      startCarousel();
    }
  }

  // --- Lógica para el Lightbox de la galería ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');

    // Seleccionamos todos los elementos que pueden abrir el lightbox
    const triggerElements = document.querySelectorAll('.gallery-item, .lightbox-trigger');

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
    };

    triggerElements.forEach(item => {
      item.addEventListener('click', () => {
        let imgSrc, imgAlt, captionText;

        if (item.classList.contains('gallery-item')) {
          // Lógica para los items de la galería
          const img = item.querySelector('img');
          const caption = item.querySelector('figcaption');
          imgSrc = img.src;
          imgAlt = img.alt;
          captionText = caption.textContent;
        } else {
          // Lógica para otros triggers (como la imagen de ubicación)
          imgSrc = item.src;
          imgAlt = item.alt;
          captionText = item.dataset.caption || ''; // Usamos data-caption
        }

        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('is-visible');
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }

  // --- Lógica para la animación de la sección "Nosotros" ---
  const aboutSection = document.querySelector('.about-sticky-wrapper');
  if (aboutSection) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Añade la clase 'is-pinned' cuando la sección entra en la vista
        // y la quita cuando sale.
        entry.target.classList.toggle('is-pinned', entry.isIntersecting);
      },
      {
        // Se activa cuando la parte superior de la sección llega a 100px
        // desde la parte superior de la ventana.
        rootMargin: '-100px 0px -25% 0px',
        threshold: 0,
      }
    );

    observer.observe(aboutSection);
  }

  // --- Lógica para el filtro del portafolio ---
  const filterContainer = document.querySelector('.portfolio-filters');
  if (filterContainer) {
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-items-grid .gallery-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');

        // Actualizar el botón activo
        filterButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');

        // Filtrar los elementos
        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');

          // Añadimos una transición para suavizar la aparición/desaparición
          item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

          if (filterValue === 'all' || filterValue === itemCategory) {
            item.style.display = 'block';
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          } else {
            item.style.transform = 'scale(0.9)';
            item.style.opacity = '0';
            // Usamos un timeout para que la animación se vea antes de ocultar el elemento
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // --- Lógica para activar el filtro desde la URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const filterFromURL = urlParams.get('filter');

  if (filterFromURL && filterContainer) {
    const buttonToActivate = filterContainer.querySelector(`.filter-btn[data-filter="${filterFromURL}"]`);
    if (buttonToActivate) {
      buttonToActivate.click();
    }
  }

  // --- Lógica para pausar un video de Instagram al reproducir otro ---
  const videoCards = document.querySelectorAll('.video-card');

  if (videoCards.length > 1) {
    // Función para recargar el iframe de un video, lo que lo detiene.
    const pauseVideo = (card) => {
      // Esperamos a que el script de Instagram cree el iframe.
      setTimeout(() => {
        const iframe = card.querySelector('iframe.instagram-media');
        if (iframe) {
          // Recargar el iframe para detener la reproducción.
          iframe.src = iframe.src;
        }
      }, 100); // Un pequeño retardo para asegurar que el iframe exista.
    };

    videoCards.forEach((clickedCard, index) => {
      clickedCard.addEventListener('click', () => {
        // Cuando se hace clic en una tarjeta, pausamos los videos en las OTRAS tarjetas.
        videoCards.forEach((otherCard, otherIndex) => {
          if (index !== otherIndex) {
            pauseVideo(otherCard);
          }
        });
      });
    });
  }
});
