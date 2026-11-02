const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const heroNamePath = document.querySelector('.hero-name-curve textPath');
const heroTaglinePath = document.querySelector('.hero-subheadline-curve textPath');
const reduceHeroMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const aboutGreeting = document.querySelector('.about-greeting');
const aboutBand = document.querySelector('.wave--about');
const aboutSummary = document.querySelector('.about-summary');
const bioPortrait = document.querySelector('.about-portrait');
const bioPortraitBurst = document.querySelector('.portrait-burst');
const aboutGreetingText = aboutGreeting?.querySelector('text');
const howdyPath = aboutGreeting?.querySelector('path');

if (aboutGreeting && aboutBand && howdyPath) {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const bandPath = document.createElementNS(svgNamespace, 'path');
  bandPath.setAttribute('d', 'M0 311C106 311 163 234 335 238C528 242 641 357 856 354C1070 351 1124 245 1291 245');
  const bandPathLength = bandPath.getTotalLength();
  const bandBottomPath = document.createElementNS(svgNamespace, 'path');
  bandBottomPath.setAttribute('d', 'M0 831C106 831 163 754 335 758C528 762 641 877 856 874C1070 871 1124 765 1291 765');
  const bandBottomPathLength = bandBottomPath.getTotalLength();
  const isCurvedAboutLayout = () => window.getComputedStyle(aboutBand).display !== 'none';

  const clearAboutInlinePositioning = () => {
    aboutSummary?.style.removeProperty('top');
    bioPortrait?.style.removeProperty('top');
    bioPortraitBurst?.style.removeProperty('top');
    bioPortraitBurst?.style.removeProperty('left');
  };

  const getBandPointAtX = (path, pathLength, targetX) => {
    let low = 0;
    let high = pathLength;

    for (let iteration = 0; iteration < 18; iteration += 1) {
      const midpoint = (low + high) / 2;
      if (path.getPointAtLength(midpoint).x < targetX) low = midpoint;
      else high = midpoint;
    }

    return path.getPointAtLength((low + high) / 2);
  };

  const alignHowdyWithBand = () => {
    const greetingBounds = aboutGreeting.getBoundingClientRect();
    const bandBounds = aboutBand.getBoundingClientRect();
    if (!greetingBounds.width || !greetingBounds.height || !bandBounds.width || !bandBounds.height) return;

    const xScale = greetingBounds.width / 420;
    const yScale = greetingBounds.height / 170;
    const bandXScale = bandBounds.width / 1291;
    const bandYScale = bandBounds.height / 912;
    const curveGap = Math.min(34, Math.max(16, window.innerWidth * 0.025));
    const points = [];

    for (let localX = 15; localX <= 405; localX += 10) {
      const screenX = greetingBounds.left + (localX * xScale);
      const sourceX = Math.min(1291, Math.max(0, (screenX - bandBounds.left) / bandXScale));
      const sourcePoint = getBandPointAtX(bandPath, bandPathLength, sourceX);
      const bandScreenY = bandBounds.top + (sourcePoint.y * bandYScale);
      const localY = (bandScreenY - curveGap - greetingBounds.top) / yScale;
      points.push(`${localX} ${localY.toFixed(2)}`);
    }

    howdyPath.setAttribute('d', `M${points.join(' L')}`);
  };

  const centerBioWithinBand = () => {
    if (!aboutSummary) return;

    const summaryBounds = aboutSummary.getBoundingClientRect();
    const bandBounds = aboutBand.getBoundingClientRect();
    if (!summaryBounds.width || !summaryBounds.height || !bandBounds.width || !bandBounds.height) return;

    const bandXScale = bandBounds.width / 1291;
    const bandYScale = bandBounds.height / 912;
    const summaryCenterX = summaryBounds.left + (summaryBounds.width / 2);
    const sourceX = Math.min(1291, Math.max(0, (summaryCenterX - bandBounds.left) / bandXScale));
    const topPoint = getBandPointAtX(bandPath, bandPathLength, sourceX);
    const bottomPoint = getBandPointAtX(bandBottomPath, bandBottomPathLength, sourceX);
    const stripeTop = bandBounds.top + (topPoint.y * bandYScale);
    const stripeBottom = bandBounds.top + (bottomPoint.y * bandYScale);
    const opticalOffset = Math.min(42, Math.max(24, window.innerWidth * 0.03));
    const centeredTop = ((stripeTop + stripeBottom) / 2) - (summaryBounds.height / 2) - opticalOffset;

    aboutSummary.style.top = `${(centeredTop - bandBounds.top).toFixed(2)}px`;
  };

  const alignPortraitWithGreeting = () => {
    if (!aboutGreetingText || !bioPortrait || !bioPortraitBurst) return;

    const greetingTextBounds = aboutGreetingText.getBoundingClientRect();
    const portraitBounds = bioPortrait.getBoundingClientRect();
    const burstBounds = bioPortraitBurst.getBoundingClientRect();
    const bandBounds = aboutBand.getBoundingClientRect();
    const portraitTop = greetingTextBounds.top - bandBounds.top + 20;
    const burstTop = portraitTop - (burstBounds.height / 2) + 3;
    const burstLeft = portraitBounds.right - bandBounds.left - (burstBounds.width / 2) - 3;

    bioPortrait.style.top = `${portraitTop.toFixed(2)}px`;
    bioPortraitBurst.style.top = `${burstTop.toFixed(2)}px`;
    bioPortraitBurst.style.left = `${burstLeft.toFixed(2)}px`;
  };

  const alignAboutContentWithBand = () => {
    if (!isCurvedAboutLayout()) {
      clearAboutInlinePositioning();
      return;
    }

    alignHowdyWithBand();
    centerBioWithinBand();
    alignPortraitWithGreeting();
  };

  const aboutCurveObserver = new ResizeObserver(() => window.requestAnimationFrame(alignAboutContentWithBand));
  aboutCurveObserver.observe(document.documentElement);
  aboutCurveObserver.observe(aboutGreeting);
  aboutCurveObserver.observe(aboutBand);
  if (aboutSummary) aboutCurveObserver.observe(aboutSummary);
  window.addEventListener('load', alignAboutContentWithBand, { once: true });
  document.fonts?.ready.then(alignAboutContentWithBand);
  alignAboutContentWithBand();
}

if (heroNamePath && heroTaglinePath && !reduceHeroMotion) {
  document.documentElement.classList.add('hero-motion-active');

  const animateAlongPath = ({ element, from, to, duration, delay }) => {
    const text = element.closest('text');
    element.setAttribute('startOffset', `${from}%`);
    text.style.opacity = '0';

    window.setTimeout(() => {
      const startTime = performance.now();

      const animateFrame = currentTime => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - ((1 - progress) ** 3);
        const currentOffset = from + ((to - from) * easedProgress);

        element.setAttribute('startOffset', `${currentOffset}%`);
        text.style.opacity = String(Math.min(progress * 4, 1));

        if (progress < 1) {
          window.requestAnimationFrame(animateFrame);
        } else {
          element.setAttribute('startOffset', `${to}%`);
          text.style.opacity = '1';
        }
      };

      window.requestAnimationFrame(animateFrame);
    }, delay);
  };

  animateAlongPath({ element: heroNamePath, from: -55, to: 51.5, duration: 1750, delay: 100 });
  animateAlongPath({ element: heroTaglinePath, from: 155, to: 50, duration: 1750, delay: 270 });

  window.setTimeout(() => document.documentElement.classList.remove('hero-motion-active'), 2600);
}

if (menuButton && navLinks) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Open menu';
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open menu' : 'Close menu';
    navLinks.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const desktopNavigationQuery = window.matchMedia('(min-width: 901px)');
  desktopNavigationQuery.addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

const aboutNavLinks = document.querySelectorAll('.nav-links a[href="#about"], .hero-scroll-indicator[href="#about"]');
const aboutPortrait = document.querySelector('.about-portrait');

if (aboutNavLinks.length && aboutPortrait) {
  aboutNavLinks.forEach(aboutNavLink => aboutNavLink.addEventListener('click', event => {
    event.preventDefault();

    const portraitBounds = aboutPortrait.getBoundingClientRect();
    const portraitCenter = window.scrollY + portraitBounds.top + (portraitBounds.height / 2);
    const targetScrollTop = Math.max(0, portraitCenter - (window.innerHeight / 2));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.history.pushState(null, '', '#about');
    window.scrollTo({
      top: targetScrollTop,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }));
}

const projectsNavLink = document.querySelector('.nav-links a[href="#projects"]');
const projectsTitle = document.querySelector('.projects-section .section-heading h2');

if (projectsNavLink && projectsTitle) {
  projectsNavLink.addEventListener('click', event => {
    event.preventDefault();

    const titleTop = window.scrollY + projectsTitle.getBoundingClientRect().top;
    const targetScrollTop = Math.max(0, titleTop - 24);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.history.pushState(null, '', '#projects');
    window.scrollTo({
      top: targetScrollTop,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });
}

const aboutGallery = document.querySelector('[data-about-gallery]');

if (aboutGallery) {
  const galleryPhotos = Array.from({ length: 37 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `assets/images/portfolio-v2/about-gallery/photo-${number}.jpg?v=3`;
  });

  const shufflePhotos = photos => {
    const shuffled = [...photos];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };

  const createGalleryRow = photos => {
    const row = document.createElement('div');
    const track = document.createElement('div');
    row.className = 'about-gallery-row';
    track.className = 'about-gallery-track';

    [...photos, ...photos].forEach((photo, index) => {
      const image = document.createElement('img');
      image.src = photo;
      image.alt = '';
      image.decoding = 'async';
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove(), { once: true });
      if (index >= photos.length) image.setAttribute('aria-hidden', 'true');
      track.append(image);
    });

    row.append(track);
    return row;
  };

  const showScrollingGallery = photos => {
    const orderedPhotos = shufflePhotos(photos);
    const rows = [
      orderedPhotos.filter((_, index) => index % 2 === 0),
      orderedPhotos.filter((_, index) => index % 2 === 1)
    ];

    aboutGallery.classList.add('about-gallery--marquee');
    aboutGallery.replaceChildren(...rows.map(createGalleryRow));
  };

  showScrollingGallery(galleryPhotos);
}
