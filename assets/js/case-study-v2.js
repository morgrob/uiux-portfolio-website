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

if (document.body.dataset.inlineEditor === 'true') {
  const storageKey = `portfolio-inline-editor:${window.location.pathname}`;
  const editableSelector = [
    '.project-landing h1',
    '.project-landing .left-info > .row > p',
    '.project-landing .eyebrow',
    '.project-landing .info-block-main',
    '.project-section > h2',
    '.project-section h3',
    '.project-section h4',
    '.project-section h5',
    '.project-section h6',
    '.project-section p',
    '.project-section li:not(:has(p))',
    '.project-section blockquote',
    '.project-section figcaption',
    '.project-section th',
    '.project-section td',
    '.case-study-footer p'
  ].join(',');
  const editableElements = [...document.querySelectorAll(editableSelector)];
  const impactSection = [...document.querySelectorAll('.project-section')].find(section => (
    section.querySelector(':scope > h2')?.textContent.trim() === 'Impact & Outcome'
  ));
  const impactHeading = impactSection?.querySelector(':scope > h2');
  const impactBody = impactSection?.querySelector(':scope > p');
  let savedRange = null;
  let saveTimer = null;

  const readSavedEdits = () => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey)) || {};
    } catch (error) {
      return {};
    }
  };

  const savedEdits = readSavedEdits();
  editableElements.forEach((element, index) => {
    const editorId = element === impactHeading
      ? 'impact-heading'
      : element === impactBody ? 'impact-body' : `text-${index}`;
    element.dataset.inlineEditorId = editorId;
    element.contentEditable = 'false';
    if (Object.prototype.hasOwnProperty.call(savedEdits, editorId)) {
      const savedEdit = savedEdits[editorId];
      if (typeof savedEdit === 'string') {
        element.innerHTML = savedEdit;
      } else {
        element.innerHTML = savedEdit.html;
        if (savedEdit.style) element.setAttribute('style', savedEdit.style);
      }
    }
  });

  const saveEdits = () => {
    const edits = {};
    editableElements.forEach(element => {
      edits[element.dataset.inlineEditorId] = {
        html: element.innerHTML,
        style: element.getAttribute('style') || ''
      };
    });
    window.localStorage.setItem(storageKey, JSON.stringify(edits));
  };

  const queueSave = () => {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveEdits, 180);
  };

  const toolbar = document.createElement('div');
  toolbar.className = 'inline-editor-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Page text editor');
  toolbar.innerHTML = `
    <button class="inline-editor-toggle" type="button">Edit page</button>
    <div class="inline-editor-controls">
      <button type="button" data-command="bold" aria-label="Semibold"><strong>B</strong></button>
      <button type="button" data-command="italic" aria-label="Italic"><em>I</em></button>
      <button type="button" data-command="underline" aria-label="Underline"><u>U</u></button>
      <div class="inline-editor-alignment" role="group" aria-label="Text alignment">
        <button type="button" data-command="justifyLeft" aria-label="Align left" title="Align left">
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14M2 7h9M2 11h14M2 15h10"/></svg>
        </button>
        <button type="button" data-command="justifyCenter" aria-label="Align center" title="Align center">
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14M4.5 7h9M2 11h14M4 15h10"/></svg>
        </button>
        <button type="button" data-command="justifyRight" aria-label="Align right" title="Align right">
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14M7 7h9M2 11h14M6 15h10"/></svg>
        </button>
        <button type="button" data-command="justifyFull" aria-label="Justify text" title="Justify text">
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14M2 7h14M2 11h14M2 15h14"/></svg>
        </button>
      </div>
      <div class="inline-editor-presets" aria-label="Text style presets">
        <button type="button" data-style-preset="body" title="Body text — Alt/Option + Shift + 1">Body</button>
        <button type="button" data-style-preset="secondary" title="Secondary header — Alt/Option + Shift + 2">Secondary</button>
        <button type="button" data-style-preset="tertiary" title="Tertiary header — Alt/Option + Shift + 3">Tertiary</button>
      </div>
      <span class="inline-editor-current-style" role="status" aria-live="polite">Select text</span>
      <select class="inline-editor-size" aria-label="Font size">
        <option value="">Size</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
        <option value="32px">32</option>
        <option value="40px">40</option>
      </select>
      <input class="inline-editor-color" type="color" value="#000000" aria-label="Text color">
      <label class="inline-editor-opacity-control">
        <span>Opacity</span>
        <input class="inline-editor-opacity" type="range" min="0" max="100" step="5" value="100" aria-label="Text opacity">
        <output class="inline-editor-opacity-value">100%</output>
      </label>
      <button type="button" data-command="removeFormat" aria-label="Clear formatting">Clear</button>
      <button class="inline-editor-reset" type="button">Reset</button>
    </div>`;
  document.body.append(toolbar);

  const toggleButton = toolbar.querySelector('.inline-editor-toggle');
  const sizeControl = toolbar.querySelector('.inline-editor-size');
  const colorControl = toolbar.querySelector('.inline-editor-color');
  const opacityControl = toolbar.querySelector('.inline-editor-opacity');
  const opacityValue = toolbar.querySelector('.inline-editor-opacity-value');
  const currentStyle = toolbar.querySelector('.inline-editor-current-style');
  const stylePresets = {
    body: {
      'font-size': '18pt',
      'font-weight': '400',
      color: 'rgba(0, 0, 0, .65)'
    },
    secondary: {
      'font-size': '20pt',
      'font-weight': '600',
      color: '#000'
    },
    tertiary: {
      'font-size': '18pt',
      'font-weight': '600',
      color: '#000'
    }
  };

  const numericWeight = weight => {
    if (weight === 'normal') return 400;
    if (weight === 'bold') return 700;
    return Number.parseInt(weight, 10) || 400;
  };

  const parseColor = color => {
    const channels = color.match(/[\d.]+/g)?.map(Number) || [];
    return {
      red: channels[0] ?? 0,
      green: channels[1] ?? 0,
      blue: channels[2] ?? 0,
      alpha: channels[3] ?? 1
    };
  };

  const selectionStyleTarget = () => {
    if (!savedRange) return null;
    const node = savedRange.startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return element?.closest('[data-inline-editor-id], [data-inline-editor-id] *') || null;
  };

  const updateToolbarState = () => {
    const target = selectionStyleTarget();
    if (!target) {
      currentStyle.textContent = 'Select text';
      opacityControl.value = '100';
      opacityValue.textContent = '100%';
      toolbar.querySelectorAll('.is-active').forEach(control => control.classList.remove('is-active'));
      return;
    }

    const styles = window.getComputedStyle(target);
    const sizePx = Number.parseFloat(styles.fontSize);
    const sizePt = Math.round(sizePx * .75 * 10) / 10;
    const weight = numericWeight(styles.fontWeight);
    const color = parseColor(styles.color);
    const opacityPercent = Math.round(Number.parseFloat(styles.opacity) * 100);
    const isBlack = color.red === 0 && color.green === 0 && color.blue === 0;
    const opaqueBlack = isBlack && color.alpha >= .99;
    const bodyBlack = isBlack && Math.abs(color.alpha - .65) < .02;
    const presetStates = {
      body: Math.abs(sizePx - 24) < .2 && weight === 400 && bodyBlack,
      secondary: Math.abs(sizePx - (20 / .75)) < .2 && weight === 600 && opaqueBlack,
      tertiary: Math.abs(sizePx - 24) < .2 && weight === 600 && opaqueBlack
    };
    const activePreset = Object.entries(presetStates).find(([, active]) => active)?.[0];
    const presetLabel = activePreset
      ? `${activePreset.charAt(0).toUpperCase()}${activePreset.slice(1)} · `
      : '';
    const weightLabel = weight === 400 ? 'Regular' : weight === 600 ? 'Semibold' : weight >= 700 ? 'Bold' : `${weight}`;
    const colorLabel = isBlack
      ? `Black ${Math.round(color.alpha * 100)}%`
      : styles.color;
    const normalizedAlign = styles.textAlign === 'start'
      ? 'left'
      : styles.textAlign === 'end' ? 'right' : styles.textAlign;
    const alignLabel = `${normalizedAlign.charAt(0).toUpperCase()}${normalizedAlign.slice(1)}`;
    currentStyle.textContent = `${presetLabel}${sizePt}pt · ${weightLabel} · ${colorLabel} · ${opacityPercent}% opacity · ${alignLabel}`;

    toolbar.querySelectorAll('[data-style-preset]').forEach(button => {
      const active = presetStates[button.dataset.stylePreset];
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const commandStates = {
      bold: weight >= 600,
      italic: styles.fontStyle !== 'normal',
      underline: styles.textDecorationLine.includes('underline'),
      justifyLeft: styles.textAlign === 'left' || styles.textAlign === 'start',
      justifyCenter: styles.textAlign === 'center',
      justifyRight: styles.textAlign === 'right' || styles.textAlign === 'end',
      justifyFull: styles.textAlign === 'justify'
    };
    toolbar.querySelectorAll('[data-command]').forEach(button => {
      if (!(button.dataset.command in commandStates)) return;
      const active = commandStates[button.dataset.command];
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const matchingSize = [...sizeControl.options].find(option => (
      option.value && Math.abs(Number.parseFloat(option.value) - sizePx) < .2
    ));
    sizeControl.value = matchingSize?.value || '';
    colorControl.value = `#${[color.red, color.green, color.blue]
      .map(channel => Math.round(channel).toString(16).padStart(2, '0'))
      .join('')}`;
    opacityControl.value = String(opacityPercent);
    opacityValue.textContent = `${opacityPercent}%`;
  };

  const setEditing = enabled => {
    document.body.classList.toggle('inline-editing', enabled);
    editableElements.forEach(element => {
      element.contentEditable = String(enabled);
      element.spellcheck = enabled;
    });
    toggleButton.textContent = enabled ? 'Done editing' : 'Edit page';
    if (enabled) updateToolbarState();
  };

  const restoreSelection = () => {
    if (!savedRange) return false;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
    return true;
  };

  const selectedEditable = () => {
    if (!savedRange) return null;
    const node = savedRange.commonAncestorContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return element?.closest('[data-inline-editor-id]') || null;
  };

  const applyStyleSet = styles => {
    if (!restoreSelection()) return;
    const selection = window.getSelection();
    const range = selection.rangeCount ? selection.getRangeAt(0) : null;
    const editable = selectedEditable();
    if (!range || !editable) return;

    if (range.collapsed) {
      Object.entries(styles).forEach(([property, value]) => {
        editable.style.setProperty(property, value, 'important');
      });
    } else {
      const span = document.createElement('span');
      Object.entries(styles).forEach(([property, value]) => {
        span.style.setProperty(property, value, 'important');
      });
      span.append(range.extractContents());
      range.insertNode(span);
      range.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
      savedRange = range.cloneRange();
    }
    saveEdits();
    updateToolbarState();
  };

  const applyInlineStyle = (property, value) => applyStyleSet({ [property]: value });

  toggleButton.addEventListener('click', () => {
    setEditing(!document.body.classList.contains('inline-editing'));
  });

  toolbar.querySelectorAll('[data-command]').forEach(button => {
    button.addEventListener('mousedown', event => event.preventDefault());
    button.addEventListener('click', () => {
      restoreSelection();
      const alignmentValues = {
        justifyLeft: 'left',
        justifyCenter: 'center',
        justifyRight: 'right',
        justifyFull: 'justify'
      };
      const selection = window.getSelection();
      const range = selection.rangeCount ? selection.getRangeAt(0) : null;
      const editable = selectedEditable();
      if (range?.collapsed && editable && button.dataset.command in alignmentValues) {
        editable.style.setProperty('text-align', alignmentValues[button.dataset.command], 'important');
        saveEdits();
        updateToolbarState();
        return;
      }
      document.execCommand('styleWithCSS', false, true);
      document.execCommand(button.dataset.command, false);
      saveEdits();
      updateToolbarState();
    });
  });

  toolbar.querySelectorAll('[data-style-preset]').forEach(button => {
    button.addEventListener('mousedown', event => event.preventDefault());
    button.addEventListener('click', () => applyStyleSet(stylePresets[button.dataset.stylePreset]));
  });

  sizeControl.addEventListener('change', () => {
    if (sizeControl.value) applyInlineStyle('font-size', sizeControl.value);
    sizeControl.value = '';
  });

  colorControl.addEventListener('input', () => applyInlineStyle('color', colorControl.value));

  opacityControl.addEventListener('input', () => {
    opacityValue.textContent = `${opacityControl.value}%`;
  });
  opacityControl.addEventListener('change', () => {
    applyInlineStyle('opacity', String(Number(opacityControl.value) / 100));
  });

  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('inline-editing') || !event.altKey || !event.shiftKey) return;
    const presetByKey = { Digit1: 'body', Digit2: 'secondary', Digit3: 'tertiary' };
    const preset = presetByKey[event.code];
    if (!preset) return;
    event.preventDefault();
    applyStyleSet(stylePresets[preset]);
  });

  toolbar.querySelector('.inline-editor-reset').addEventListener('click', () => {
    if (!window.confirm('Reset all locally saved text and formatting on this page?')) return;
    window.localStorage.removeItem(storageKey);
    window.location.reload();
  });

  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    if (element?.closest('[data-inline-editor-id]')) {
      savedRange = range.cloneRange();
      updateToolbarState();
    }
  });

  document.querySelector('.project-container')?.addEventListener('input', () => {
    queueSave();
    updateToolbarState();
  });
  caseFooter?.addEventListener('input', () => {
    queueSave();
    updateToolbarState();
  });
  window.addEventListener('beforeunload', saveEdits);
}
