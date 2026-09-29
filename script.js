document.getElementById('year').textContent = new Date().getFullYear();

const galleryImages = Array.from(document.querySelectorAll('.gallery-grid .photo-card img'));
let currentImageIndex = 0;

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('aria-hidden', 'true');
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="关闭">×</button>
  <button class="lightbox-nav lightbox-prev" aria-label="上一张">‹</button>
  <div class="lightbox-stage">
    <img class="lightbox-image" alt="">
    <div class="lightbox-caption"></div>
    <div class="lightbox-counter"></div>
  </div>
  <button class="lightbox-nav lightbox-next" aria-label="下一张">›</button>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxCounter = lightbox.querySelector('.lightbox-counter');

function showImage(index) {
  currentImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentImageIndex];
  const caption = image.closest('.photo-card')?.querySelector('figcaption')?.textContent || image.alt || '';
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt || caption;
  lightboxCaption.textContent = caption;
  lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(index) {
  showImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}

galleryImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `查看大图：${image.alt || index + 1}`);
  image.addEventListener('click', () => openLightbox(index));
  image.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', event => { event.stopPropagation(); showImage(currentImageIndex - 1); });
lightbox.querySelector('.lightbox-next').addEventListener('click', event => { event.stopPropagation(); showImage(currentImageIndex + 1); });
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'ArrowLeft') showImage(currentImageIndex - 1);
  if (event.key === 'ArrowRight') showImage(currentImageIndex + 1);
  if (event.key === 'Escape') closeLightbox();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, {passive:true});
lightbox.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) < 50) return;
  if (delta > 0) showImage(currentImageIndex - 1);
  else showImage(currentImageIndex + 1);
}, {passive:true});