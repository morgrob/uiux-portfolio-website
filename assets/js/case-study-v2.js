const legacyThemeStylesheet = document.getElementById('style-switch');

if (legacyThemeStylesheet) {
  legacyThemeStylesheet.href = new URL('../assets/css/style.css', window.location.href).href;
}

const caseHeader = document.querySelector('header');
const caseStudySlugs = ['bubbly', 'intel-otg', 'datascape', 'luminary', 'centible'];
const caseStudySlug = caseStudySlugs.find(slug => window.location.pathname.includes(`/${slug}/`)) || 'bubbly';
const caseStudyOffset = caseStudySlugs.indexOf(caseStudySlug);

document.body.classList.add(`case-study--${caseStudySlug}`);

if (caseHeader) {
  caseHeader.className = 'case-header';
  caseHeader.innerHTML = `
    <nav class="site-nav" aria-label="Primary navigation">
      <a class="brand" href="../index.html" aria-label="Morgan Roberts, home">
        <img src="../assets/images/favicon.svg" alt="" width="59" height="35">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="case-nav-links">
        <span class="sr-only">Open menu</span>
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links" id="case-nav-links">
        <a href="../index.html#about">About</a>
        <a class="active" href="../index.html#projects">Projects</a>
        <a href="../assets/Morgan-Roberts-Product-Designer-Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
      </div>
    </nav>`;
}

const menuButton = document.querySelector('.case-header .menu-toggle');
const navLinks = document.querySelector('.case-header .nav-links');

if (menuButton && navLinks) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Open menu';
    navLinks.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open menu' : 'Close menu';
    navLinks.classList.toggle('is-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

document.querySelectorAll('.project-section > h2').forEach((heading, index) => {
  heading.textContent = heading.textContent.replace(/^[^A-Za-z0-9]+\s*/, '');
  heading.classList.add(`case-section-star--${(index + caseStudyOffset) % 3}`);
});

const caseFooter = document.querySelector('footer.footer, footer.site-footer');
if (caseFooter) {
  caseFooter.className = 'site-footer case-study-footer';
  caseFooter.innerHTML = `
    <img class="wave wave--footer" src="../assets/images/portfolio-v2/figma-footer-wave.svg" alt="" width="1291" height="491">
    <p>Made with <span aria-label="love">&hearts;</span> by Morgan Roberts &copy; 2026</p>`;
}

const intelDesignSection = document.querySelector('.intel-design-section');

if (intelDesignSection) {
  const sectionChildren = [...intelDesignSection.children];
  const firstSubsectionIndex = sectionChildren.findIndex(element => element.matches('h3'));
  let currentCase = null;

  sectionChildren.slice(firstSubsectionIndex).forEach(element => {
    if (element.matches('h3')) {
      currentCase = document.createElement('article');
      currentCase.className = 'intel-design-case';

      const copy = document.createElement('div');
      copy.className = 'intel-design-copy';
      const media = document.createElement('div');
      media.className = 'intel-design-media';
      copy.append(element);
      currentCase.append(copy, media);
      intelDesignSection.append(currentCase);
      return;
    }

    if (!currentCase) return;
    const copy = currentCase.querySelector('.intel-design-copy');
    const media = currentCase.querySelector('.intel-design-media');
    const isDescription = element.matches('p') && !copy.querySelector(':scope > p');
    const isEmptySpacer = element.matches('p') && !element.textContent.trim() && !element.querySelector('img, video, iframe');

    if (isEmptySpacer) {
      element.remove();
    } else if (isDescription) {
      copy.append(element);
    } else {
      media.append(element);
    }
  });
}

if (caseStudySlug === 'bubbly') {
  const bubblyHeadings = [...document.querySelectorAll('.project-section h3')];
  const headingNamed = name => bubblyHeadings.find(heading => heading.textContent.trim() === name);
  const createMediaRow = (copyNodes, mediaNode, label) => {
    if (!copyNodes[0] || !mediaNode) return;

    const row = document.createElement('article');
    const copy = document.createElement('div');
    const media = document.createElement('div');
    row.className = 'bubbly-media-case';
    row.dataset.mediaLabel = label;
    copy.className = 'bubbly-media-copy';
    media.className = 'bubbly-media-content';

    copyNodes[0].parentElement.insertBefore(row, copyNodes[0]);
    copyNodes.forEach(node => copy.append(node));
    media.append(mediaNode);
    row.append(copy, media);
  };

  const personasHeading = headingNamed('Personas');
  const personasCopy = personasHeading?.nextElementSibling;
  const personasMedia = personasCopy?.nextElementSibling;
  createMediaRow([personasHeading, personasCopy], personasMedia, 'Personas');

  const userFlowHeading = headingNamed('User Flow');
  const userFlowCopy = userFlowHeading?.nextElementSibling;
  const userFlowMedia = userFlowCopy?.nextElementSibling;
  createMediaRow([userFlowHeading, userFlowCopy], userFlowMedia, 'User Flow');

  const wireframesHeading = headingNamed('Wireframes');
  const wireframesCopy = wireframesHeading?.nextElementSibling;
  const wireframesMedia = wireframesCopy?.nextElementSibling;
  const layoutCopy = wireframesMedia?.nextElementSibling;
  const layoutMedia = layoutCopy?.nextElementSibling;
  const refinedCopy = layoutMedia?.nextElementSibling;
  const refinedMedia = refinedCopy?.nextElementSibling;

  createMediaRow([wireframesHeading, wireframesCopy], wireframesMedia, 'Initial Wireframes');
  createMediaRow([layoutCopy], layoutMedia, 'Wireframe Layout Options');
  createMediaRow([refinedCopy], refinedMedia, 'Refined Wireframes');
}

const multiImageGroups = [...document.querySelectorAll('.project-section .row')].filter(group => {
  const slides = [...group.children];
  return group.dataset.carousel !== 'false'
    && group.querySelectorAll('img').length > 1
    && slides.length > 1
    && slides.every(slide => slide.matches('img') || slide.querySelector('img'));
});

multiImageGroups.forEach((group, carouselIndex) => {
  const sourceSlides = [...group.children];
  const slides = [];
  const pairedCase = group.closest('.intel-design-case, .bubbly-media-case, .datascape-media-case, .luminary-media-case');
  const pairedHeading = pairedCase?.querySelector('h3');
  const pairedLabel = pairedCase?.dataset.mediaLabel;
  const closestHeading = pairedHeading || [...group.parentElement.children]
    .slice(0, [...group.parentElement.children].indexOf(group))
    .reverse()
    .find(element => element.matches('h3, h4, h5, h6'));
  const carouselLabel = pairedLabel || closestHeading
    ? `${pairedLabel || closestHeading.textContent.trim()} image gallery`
    : `Project image gallery ${carouselIndex + 1}`;
  let activeIndex = 0;
  let pointerStartX = null;

  group.className = 'case-carousel';
  group.setAttribute('role', 'region');
  group.setAttribute('aria-roledescription', 'carousel');
  group.setAttribute('aria-label', carouselLabel);
  group.tabIndex = 0;

  const viewport = document.createElement('div');
  viewport.className = 'case-carousel-viewport';
  const track = document.createElement('div');
  track.className = 'case-carousel-track';
  viewport.append(track);

  sourceSlides.forEach((sourceSlide, slideIndex) => {
    const slide = document.createElement('div');
    slide.classList.add('case-carousel-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    const caption = sourceSlide.matches('img')
      ? null
      : [...sourceSlide.children].find(child => child.matches('p, figcaption'));
    const captionText = caption?.textContent.trim();

    if (caption) caption.classList.add('case-carousel-caption');
    if (!sourceSlide.matches('img')) sourceSlide.classList.add('case-carousel-slide-content');
    slide.setAttribute(
      'aria-label',
      `${slideIndex + 1} of ${sourceSlides.length}${captionText ? `: ${captionText}` : ''}`
    );
    slide.append(sourceSlide);
    track.append(slide);
    slides.push(slide);
  });

  const controls = document.createElement('div');
  controls.className = 'case-carousel-controls';
  controls.innerHTML = `
    <button class="case-carousel-button case-carousel-previous" type="button" aria-label="Previous image">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="case-carousel-pagination" aria-label="Choose image"></div>
    <button class="case-carousel-button case-carousel-next" type="button" aria-label="Next image">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <span class="case-carousel-status" aria-live="polite"></span>`;

  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'case-carousel-button case-carousel-fullscreen';
  fullscreenButton.type = 'button';
  fullscreenButton.innerHTML = `
    <svg class="case-carousel-expand-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <svg class="case-carousel-collapse-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const pagination = controls.querySelector('.case-carousel-pagination');
  slides.forEach((slide, slideIndex) => {
    const dot = document.createElement('button');
    dot.className = 'case-carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show image ${slideIndex + 1}`);
    dot.addEventListener('click', () => showSlide(slideIndex));
    pagination.append(dot);
  });

  const status = controls.querySelector('.case-carousel-status');
  const dots = [...pagination.children];

  function showSlide(nextIndex) {
    activeIndex = (nextIndex + slides.length) % slides.length;
    track.style.setProperty('--case-carousel-index', activeIndex);
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex));
    });
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === activeIndex));
    });
    status.textContent = `Image ${activeIndex + 1} of ${slides.length}`;
    scheduleFullscreenButtonPosition();
  }

  controls.querySelector('.case-carousel-previous').addEventListener('click', () => showSlide(activeIndex - 1));
  controls.querySelector('.case-carousel-next').addEventListener('click', () => showSlide(activeIndex + 1));
  let positionFrame = null;
  const positionFullscreenButton = () => {
    positionFrame = null;
    const activeImage = slides[activeIndex]?.querySelector('img');
    if (!activeImage) return;

    const groupBounds = group.getBoundingClientRect();
    const imageBounds = activeImage.getBoundingClientRect();
    const inset = 10;
    fullscreenButton.style.top = `${imageBounds.top - groupBounds.top + inset}px`;
    fullscreenButton.style.left = `${imageBounds.right - groupBounds.left - fullscreenButton.offsetWidth - inset}px`;
  };
  const scheduleFullscreenButtonPosition = () => {
    if (positionFrame !== null) cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(positionFullscreenButton);
  };
  const setFullscreenState = expanded => {
    const actionLabel = expanded ? 'Minimize' : 'Expand';
    fullscreenButton.setAttribute('aria-label', `${actionLabel} carousel`);
    fullscreenButton.setAttribute('aria-pressed', String(expanded));
    fullscreenButton.dataset.tooltip = actionLabel;
    scheduleFullscreenButtonPosition();
  };
  const exitFallbackFullscreen = () => {
    group.classList.remove('is-fullscreen-fallback');
    document.body.classList.remove('case-carousel-overlay-open');
    setFullscreenState(false);
  };

  group.addEventListener('click', event => {
    if (!group.classList.contains('is-fullscreen-fallback')) return;
    if (event.target.closest('.case-carousel-controls, .case-carousel-fullscreen')) return;

    const activeImage = slides[activeIndex]?.querySelector('img');
    if (!activeImage) return;
    const imageBounds = activeImage.getBoundingClientRect();
    const clickedImage = event.clientX >= imageBounds.left
      && event.clientX <= imageBounds.right
      && event.clientY >= imageBounds.top
      && event.clientY <= imageBounds.bottom;
    if (!clickedImage) exitFallbackFullscreen();
  });

  fullscreenButton.addEventListener('click', () => {
    if (group.classList.contains('is-fullscreen-fallback')) {
      exitFallbackFullscreen();
      return;
    }
    group.classList.add('is-fullscreen-fallback');
    document.body.classList.add('case-carousel-overlay-open');
    setFullscreenState(true);
  });
  window.addEventListener('resize', scheduleFullscreenButtonPosition);
  track.addEventListener('transitionend', event => {
    if (event.propertyName === 'transform') scheduleFullscreenButtonPosition();
  });
  slides.forEach(slide => {
    const image = slide.querySelector('img');
    if (image && !image.complete) image.addEventListener('load', scheduleFullscreenButtonPosition, { once: true });
  });
  group.addEventListener('keydown', event => {
    if (event.key === 'Escape' && group.classList.contains('is-fullscreen-fallback')) {
      exitFallbackFullscreen();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  });
  viewport.addEventListener('pointerdown', event => {
    pointerStartX = event.clientX;
  });
  viewport.addEventListener('pointerup', event => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 45) return;
    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  });
  viewport.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  group.replaceChildren(viewport, controls, fullscreenButton);
  setFullscreenState(false);
  showSlide(0);
});

if (caseStudySlug === 'bubbly') {
  document.querySelectorAll('.project-section table').forEach((table, tableIndex) => {
    if (table.closest('.mobile-table-shell')) return;

    const shell = document.createElement('div');
    const scroller = document.createElement('div');
    const indicator = document.createElement('div');
    const columnCount = table.rows[0]?.cells.length || 0;
    let precedingElement = table.previousElementSibling;

    while (precedingElement && !precedingElement.matches('h2, h3, h4, h5, h6')) {
      precedingElement = precedingElement.previousElementSibling;
    }

    const tableName = precedingElement?.textContent.trim() || `Bubbly table ${tableIndex + 1}`;

    shell.className = 'mobile-table-shell is-at-start';
    shell.dataset.columns = String(columnCount);
    scroller.className = 'mobile-table-scroll';
    scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-label', `Scrollable ${tableName} table`);
    indicator.className = 'mobile-table-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.innerHTML = `
      <span class="mobile-table-indicator__arrow mobile-table-indicator__arrow--left">&larr;</span>
      <span class="mobile-table-indicator__label">Swipe to explore</span>
      <span class="mobile-table-indicator__arrow mobile-table-indicator__arrow--right">&rarr;</span>`;

    table.before(shell);
    scroller.append(table);
    shell.append(scroller, indicator);

    let updateQueued = false;
    const updateScrollState = () => {
      updateQueued = false;
      const scrollable = scroller.scrollWidth > scroller.clientWidth + 2;
      const atStart = scroller.scrollLeft <= 2;
      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;

      shell.classList.toggle('is-scrollable', scrollable);
      shell.classList.toggle('is-at-start', !scrollable || atStart);
      shell.classList.toggle('is-at-end', !scrollable || atEnd);
    };
    const scheduleScrollStateUpdate = () => {
      if (updateQueued) return;
      updateQueued = true;
      window.requestAnimationFrame(updateScrollState);
    };

    scroller.addEventListener('scroll', scheduleScrollStateUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollStateUpdate);

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(scheduleScrollStateUpdate);
      resizeObserver.observe(scroller);
      resizeObserver.observe(table);
    }

    scheduleScrollStateUpdate();
  });
}
