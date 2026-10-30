if (document.body.dataset.inlineEditor === 'true') {
  const storageKey = `portfolio-inline-editor:${window.location.pathname || '/'}`;
  const editableSelector = [
    '.home-hero__title',
    '.home-hero__title-wrap p',
    '.about-summary h2',
    '.about-summary p',
    '.about-mobile-intro p',
    '.section-heading h2',
    '.powers-grid h3',
    '.powers-grid p',
    '.timeline-date',
    '.timeline-item h3',
    '.timeline-item .role',
    '.timeline-item div > p:last-child',
    '.project-copy h3',
    '.project-copy > p:not(.project-meta)',
    '.project-meta span',
    '.site-footer p'
  ].join(',');
  const editableElements = [...document.querySelectorAll(editableSelector)];
  let savedRange = null;
  let saveTimer = null;
  let legacyEditorIndex = 0;

  const readSavedEdits = () => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey)) || {};
    } catch (error) {
      return {};
    }
  };

  const savedEdits = readSavedEdits();
  editableElements.forEach(element => {
    const editorId = element.dataset.inlineEditorId || `home-text-${legacyEditorIndex}`;
    if (!element.dataset.inlineEditorId) legacyEditorIndex += 1;
    element.dataset.inlineEditorId = editorId;
    element.contentEditable = 'false';
    if (!Object.prototype.hasOwnProperty.call(savedEdits, editorId)) return;

    const savedEdit = savedEdits[editorId];
    if (typeof savedEdit === 'string') {
      element.innerHTML = savedEdit;
    } else {
      element.innerHTML = savedEdit.html;
      if (savedEdit.style) element.setAttribute('style', savedEdit.style);
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
        <button type="button" data-style-preset="body" title="Body text — Option + Shift + 1">Body</button>
        <button type="button" data-style-preset="secondary" title="Secondary header — Option + Shift + 2">Secondary</button>
        <button type="button" data-style-preset="tertiary" title="Tertiary header — Option + Shift + 3">Tertiary</button>
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
    const colorLabel = isBlack ? `Black ${Math.round(color.alpha * 100)}%` : styles.color;
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
    if (sizeControl.value) applyStyleSet({ 'font-size': sizeControl.value });
    sizeControl.value = '';
  });

  colorControl.addEventListener('input', () => applyStyleSet({ color: colorControl.value }));

  opacityControl.addEventListener('input', () => {
    opacityValue.textContent = `${opacityControl.value}%`;
  });
  opacityControl.addEventListener('change', () => {
    applyStyleSet({ opacity: String(Number(opacityControl.value) / 100) });
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

  document.addEventListener('input', event => {
    if (!event.target.closest?.('[data-inline-editor-id]')) return;
    queueSave();
    updateToolbarState();
  });

  document.addEventListener('click', event => {
    if (!document.body.classList.contains('inline-editing')) return;
    if (event.target.closest('a') && !event.target.closest('.inline-editor-toolbar')) {
      event.preventDefault();
    }
  }, true);

  window.addEventListener('beforeunload', saveEdits);
}
