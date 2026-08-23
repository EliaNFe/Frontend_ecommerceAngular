document.addEventListener(
  'error',
  (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;

    event.stopImmediatePropagation();

    if (image.dataset.fallbackApplied) {
      image.style.visibility = 'hidden';
      return;
    }

    image.dataset.fallbackApplied = 'true';
    image.removeAttribute('srcset');
    image.src = 'assets/product-placeholder.svg';
  },
  true,
);
