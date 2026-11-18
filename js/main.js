(() => {
  'use strict';

  const config = window.LA_SAGRADA_CONFIG;
  const products = Array.isArray(window.LA_SAGRADA_PRODUCTS) ? window.LA_SAGRADA_PRODUCTS : [];
  if (!config) return;

  const phoneChoices = [
    { label: `WhatsApp 1 · ${config.telefono1}`, number: config.whatsapp1 },
    { label: `WhatsApp 2 · ${config.telefono2}`, number: config.whatsapp2 }
  ];
  const cart = new Map();
  const catalogGrid = document.querySelector('#catalog-grid');
  const cartItems = document.querySelector('#cart-items');
  const cartCount = document.querySelector('#cart-count');
  const headerCartCount = document.querySelector('#cart-count-header');
  const toast = document.querySelector('#toast');
  let toastTimeout;

  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  };

  const whatsappUrl = (number, message) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const initialMessage = `Hola, estoy interesado en los productos de ${config.nombre}. ¿Podrían brindarme información?`;

  function fillConfiguration() {
    document.querySelectorAll('[data-config="nombre"]').forEach((node) => { node.textContent = config.nombre; });
    document.querySelectorAll('[data-config="frase"]').forEach((node) => { node.textContent = config.frase; });
    document.querySelectorAll('[data-config="direccion"]').forEach((node) => { node.textContent = config.direccion; });
    setText('[data-phone-display="1"]', config.telefono1);
    setText('[data-phone-display="2"]', config.telefono2);
    document.querySelectorAll('.brand img, .hero-logo-card img').forEach((image) => { image.src = config.rutaLogo; });
    const socialImage = document.querySelector('meta[property="og:image"]');
    if (socialImage) socialImage.content = config.rutaLogo;
    document.querySelectorAll('[data-whatsapp="1"]').forEach((link) => { link.href = whatsappUrl(config.whatsapp1, initialMessage); });
    document.querySelectorAll('[data-whatsapp="2"]').forEach((link) => { link.href = whatsappUrl(config.whatsapp2, initialMessage); });
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.mapsQuery)}`;
    const directions = document.querySelector('#directions-link');
    if (directions) directions.href = mapUrl;
    const iframe = document.querySelector('.map-frame iframe');
    if (iframe) iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(config.mapsQuery)}&output=embed`;
    const year = document.querySelector('#current-year');
    if (year) year.textContent = String(new Date().getFullYear());
    configureTikTok();
    populatePhoneSelectors();
  }

  function configureTikTok() {
    const raw = String(config.tiktokUsuario || '').trim().replace(/^@/, '');
    const isConfigured = raw.length > 0 && raw.toUpperCase() !== 'TU_USUARIO_TIKTOK';
    const handle = document.querySelector('#tiktok-handle');
    const status = document.querySelector('#tiktok-status');
    const link = document.querySelector('#tiktok-link');
    const footerLink = document.querySelector('#footer-tiktok');
    const footerPending = document.querySelector('#footer-tiktok-pending');
    if (handle) handle.textContent = isConfigured ? `@${raw}` : 'TU_USUARIO_TIKTOK';
    if (status) status.textContent = isConfigured ? 'Síguenos en TikTok' : 'Usuario pendiente de configurar';
    if (link) {
      if (isConfigured) {
        link.href = `https://www.tiktok.com/@${encodeURIComponent(raw)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.remove('is-disabled');
        link.removeAttribute('aria-disabled');
        link.removeAttribute('tabindex');
      } else {
        link.removeAttribute('href');
        link.removeAttribute('target');
        link.classList.add('is-disabled');
        link.setAttribute('aria-disabled', 'true');
        link.tabIndex = -1;
      }
    }
    if (footerLink && footerPending) {
      footerLink.hidden = !isConfigured;
      footerPending.hidden = isConfigured;
      if (isConfigured) footerLink.href = `https://www.tiktok.com/@${encodeURIComponent(raw)}`;
    }
  }

  function populatePhoneSelectors() {
    ['#cart-phone', '#inquiry-phone'].forEach((selector) => {
      const select = document.querySelector(selector);
      if (!select) return;
      select.replaceChildren();
      phoneChoices.forEach((choice, index) => {
        const option = document.createElement('option');
        option.value = choice.number;
        option.textContent = choice.label;
        option.selected = index === 0;
        select.append(option);
      });
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'product-card reveal is-visible';
    article.dataset.productId = product.id;

    const imageArea = document.createElement('div');
    imageArea.className = 'product-image';
    if (product.image) {
      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.imageAlt || product.nombre;
      image.loading = 'lazy';
      imageArea.append(image);
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'product-placeholder';
      placeholder.setAttribute('aria-hidden', 'true');
      placeholder.textContent = '❧';
      const prompt = document.createElement('span');
      prompt.className = 'photo-prompt';
      prompt.textContent = 'Fotografía del producto por agregar';
      imageArea.append(placeholder, prompt);
    }

    const content = document.createElement('div');
    content.className = 'product-content';
    const topline = document.createElement('div');
    topline.className = 'product-topline';
    const title = document.createElement('h3');
    title.textContent = product.nombre;
    const badge = document.createElement('span');
    badge.className = 'availability-pill';
    badge.textContent = 'Consultar';
    topline.append(title, badge);

    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.descripcion;
    const meta = document.createElement('div');
    meta.className = 'product-meta';
    const presentationLabel = document.createElement('span');
    presentationLabel.textContent = 'Presentación';
    const presentation = document.createElement('strong');
    presentation.textContent = product.presentacion;
    meta.append(presentationLabel, presentation);

    const priceRow = document.createElement('div');
    priceRow.className = 'product-meta product-price';
    const priceLabel = document.createElement('span');
    priceLabel.textContent = 'Precio';
    const price = document.createElement('strong');
    if (typeof product.precio === 'number' && Number.isFinite(product.precio)) {
      price.textContent = `${config.moneda || 'Bs'} ${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.precio)}`;
    } else {
      price.textContent = product.precio === null || product.precio === undefined || product.precio === '' ? 'Consultar' : String(product.precio);
    }
    priceRow.append(priceLabel, price);

    const controls = document.createElement('div');
    controls.className = 'product-controls';
    const quantity = document.createElement('input');
    quantity.className = 'quantity-control';
    quantity.type = 'number';
    quantity.min = '1';
    quantity.step = '1';
    quantity.value = '1';
    quantity.inputMode = 'numeric';
    quantity.setAttribute('aria-label', `Cantidad de ${product.nombre}`);
    const add = document.createElement('button');
    add.className = 'button product-add';
    add.type = 'button';
    add.dataset.addProduct = product.id;
    add.textContent = 'Agregar al pedido +';
    controls.append(quantity, add);

    content.append(topline, description, meta, priceRow, controls);
    article.append(imageArea, content);
    return article;
  }

  function renderCatalog() {
    if (!catalogGrid) return;
    catalogGrid.replaceChildren();
    if (!products.length) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Estamos actualizando el catálogo. Escríbenos para consultar disponibilidad.';
      catalogGrid.append(empty);
      return;
    }
    products.forEach((product) => catalogGrid.append(createProductCard(product)));
    populateProductInterest();
  }

  function populateProductInterest() {
    const select = document.querySelector('#product-interest');
    if (!select) return;
    select.replaceChildren();
    const prompt = document.createElement('option');
    prompt.value = '';
    prompt.textContent = 'Selecciona un producto';
    select.append(prompt);
    products.forEach((product) => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.nombre;
      select.append(option);
    });
    const other = document.createElement('option');
    other.value = 'consulta-general';
    other.textContent = 'Consulta general';
    select.append(other);
  }

  function productById(id) {
    return products.find((product) => product.id === id);
  }

  function renderCart() {
    if (!cartItems) return;
    cartItems.replaceChildren();
    let itemCount = 0;
    cart.forEach((quantity) => { itemCount += quantity; });
    if (cartCount) cartCount.textContent = `(${itemCount})`;
    if (headerCartCount) headerCartCount.textContent = String(itemCount);
    if (cart.size === 0) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Todavía no agregaste productos.';
      cartItems.append(empty);
      return;
    }

    cart.forEach((quantity, id) => {
      const product = productById(id);
      if (!product) return;
      const row = document.createElement('div');
      row.className = 'cart-line';
      const copy = document.createElement('div');
      copy.className = 'cart-line-copy';
      const name = document.createElement('strong');
      name.textContent = product.nombre;
      const presentation = document.createElement('span');
      presentation.textContent = product.presentacion;
      copy.append(name, presentation);
      const input = document.createElement('input');
      input.className = 'cart-line-qty';
      input.type = 'number';
      input.min = '1';
      input.step = '1';
      input.value = String(quantity);
      input.inputMode = 'numeric';
      input.dataset.cartQuantity = id;
      input.setAttribute('aria-label', `Modificar cantidad de ${product.nombre}`);
      const remove = document.createElement('button');
      remove.className = 'remove-item';
      remove.type = 'button';
      remove.dataset.removeProduct = id;
      remove.setAttribute('aria-label', `Eliminar ${product.nombre} del pedido`);
      remove.textContent = '×';
      row.append(copy, input, remove);
      cartItems.append(row);
    });
  }

  function addProduct(id, quantity) {
    if (!productById(id)) return;
    const validQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    cart.set(id, (cart.get(id) || 0) + validQuantity);
    renderCart();
    const product = productById(id);
    showToast(`${product.nombre} agregado al pedido.`);
  }

  function sendWhatsApp(number, message) {
    const link = document.createElement('a');
    link.href = whatsappUrl(number, message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    document.body.append(link);
    link.click();
    link.remove();
  }

  function confirmOrder() {
    if (cart.size === 0) {
      showToast('Agrega al menos un producto antes de preparar tu pedido.');
      return;
    }
    const number = document.querySelector('#cart-phone')?.value || config.whatsapp1;
    const lines = [];
    cart.forEach((quantity, id) => {
      const product = productById(id);
      if (product) lines.push(`Producto: ${product.nombre}\nCantidad: ${quantity}\nPresentación: ${product.presentacion}`);
    });
    const message = `Hola, ${config.nombre}. Quisiera realizar el siguiente pedido:\n\n${lines.join('\n\n')}\n\nMe gustaría consultar la disponibilidad y el precio.\n\nGracias.`;
    sendWhatsApp(number, message);
  }

  function submitInquiry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const error = document.querySelector('#form-error');
    const name = form.elements.nombre.value.trim();
    const productId = form.elements.producto.value;
    const quantityValue = form.elements.cantidad.value.trim();
    const messageText = form.elements.mensaje.value.trim();
    const selectedProduct = products.find((product) => product.id === productId);
    const productName = selectedProduct ? selectedProduct.nombre : (productId === 'consulta-general' ? 'Consulta general' : '');
    const quantity = quantityValue ? Number(quantityValue) : null;
    let errorText = '';
    if (!name || !productName) errorText = 'Completa tu nombre y selecciona el producto de interés.';
    else if (quantityValue && (!Number.isInteger(quantity) || quantity < 1)) errorText = 'La cantidad debe ser un número entero mayor que cero.';
    if (errorText) {
      error.textContent = errorText;
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const lines = [`Hola, ${config.nombre}. Soy ${name}.`, `Producto de interés: ${productName}.`];
    if (quantity !== null) lines.push(`Cantidad: ${quantity}.`);
    if (messageText) lines.push(`Consulta: ${messageText}`);
    lines.push('¿Podrían brindarme información sobre disponibilidad y precio?');
    const number = form.elements.telefono.value || config.whatsapp1;
    sendWhatsApp(number, lines.join('\n\n'));
  }

  function setupMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#primary-nav');
    if (!toggle || !nav) return;
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  function setupReveal() {
    const elements = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  }

  function setupEvents() {
    catalogGrid?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-add-product]');
      if (!button) return;
      const card = button.closest('.product-card');
      const input = card?.querySelector('.quantity-control');
      const quantity = Number(input?.value || 1);
      if (!Number.isInteger(quantity) || quantity < 1) {
        if (input) input.value = '1';
        showToast('Indica una cantidad entera mayor que cero.');
        return;
      }
      addProduct(button.dataset.addProduct, quantity);
    });
    cartItems?.addEventListener('change', (event) => {
      const input = event.target.closest('[data-cart-quantity]');
      if (!input) return;
      const id = input.dataset.cartQuantity;
      const quantity = Number(input.value);
      if (!Number.isInteger(quantity) || quantity < 1) {
        cart.delete(id);
        showToast('El artículo se quitó porque la cantidad debe ser mayor que cero.');
      } else cart.set(id, quantity);
      renderCart();
    });
    cartItems?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-product]');
      if (!button) return;
      const product = productById(button.dataset.removeProduct);
      cart.delete(button.dataset.removeProduct);
      renderCart();
      if (product) showToast(`${product.nombre} eliminado del pedido.`);
    });
    document.querySelector('#confirm-order')?.addEventListener('click', confirmOrder);
    document.querySelector('#inquiry-form')?.addEventListener('submit', submitInquiry);
    document.querySelector('#inquiry-form')?.addEventListener('input', () => {
      const error = document.querySelector('#form-error');
      if (error) error.hidden = true;
    });
  }

  fillConfiguration();
  renderCatalog();
  renderCart();
  setupMenu();
  setupReveal();
  setupEvents();
})();
