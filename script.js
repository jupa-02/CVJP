/**
 * JUAN PABLO DIAZ TOVAR - PERFIL ACADÉMICO Y PROFESIONAL
 * Lógica limpia, ejecutiva y modular para filtrado e interactividad.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavHighlight();
  initPublicationSearchAndFilters();
  initCopyEmail();
  initLandingHubInteractions();
  initLanguageSwitch();
  initBackToTop();
});

/**
 * 1. Resaltado de navegación al hacer scroll (Header Fijo)
 */
function initNavHighlight() {
  const navLinks = document.querySelectorAll('.header-nav a');
  const sections = document.querySelectorAll('main section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 2. Pestañas Editoriales y Buscador en Vivo por Palabra Clave
 */
function initPublicationSearchAndFilters() {
  const filterBtns = document.querySelectorAll('#pub-filters .filter-pill');
  const pubGroups = document.querySelectorAll('#investigacion .category-group[data-category]');
  const searchInput = document.getElementById('pub-search');

  if (!filterBtns.length || !pubGroups.length) return;

  function applyFilterAndSearch() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('#pub-filters .filter-pill.active');
    const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    pubGroups.forEach((group) => {
      const cat = group.getAttribute('data-category');
      const isGroupMatch = (activeFilter === 'all' || cat === activeFilter);
      
      let visibleInGroup = 0;
      const entries = group.querySelectorAll('.pub-entry');
      entries.forEach((entry) => {
        const text = entry.textContent.toLowerCase();
        const matchesSearch = !query || text.includes(query);
        if (isGroupMatch && matchesSearch) {
          entry.style.display = 'block';
          visibleInGroup++;
        } else {
          entry.style.display = 'none';
        }
      });

      if (isGroupMatch && visibleInGroup > 0) {
        group.style.display = 'block';
        group.style.opacity = '1';
      } else {
        group.style.display = 'none';
        group.style.opacity = '0';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilterAndSearch);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilterAndSearch();
    });
  });
}

/**
 * Helper global para notificación Toast
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * 3. Botón de copiado ejecutivo de correo
 */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  if (!copyButtons.length) return;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'juanpablodiaztovar9@gmail.com';

      if (navigator.clipboard && email) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`✓ Correo copiado: ${email}`);
        }).catch(() => {
          showToast(`Correo: ${email}`);
        });
      }
    });
  });
}

/**
 * 4. Interacciones del Landing Hub & Recursos del Video
 */
function initLandingHubInteractions() {
  // A. Copiar Cita APA
  const citeBtns = document.querySelectorAll('.copy-citation-btn');
  citeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const citation = btn.getAttribute('data-citation');
      if (navigator.clipboard && citation) {
        navigator.clipboard.writeText(citation).then(() => {
          const lang = localStorage.getItem('cv_lang') || 'es';
          const dict = window.translations || (typeof translations !== 'undefined' ? translations : null);
          const msg = (dict && dict[lang] && dict[lang]['toast.cite']) || '✓ Cita APA copiada al portapapeles';
          showToast(msg);
        }).catch(() => {
          showToast('✓ Cita copiada al portapapeles');
        });
      }
    });
  });

  // B. Acordeón de Claves del Video / Takeaways
  const toggleTakeawaysBtn = document.getElementById('toggle-takeaways');
  const takeawaysDrawer = document.getElementById('takeaways-drawer');
  if (toggleTakeawaysBtn && takeawaysDrawer) {
    toggleTakeawaysBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = takeawaysDrawer.hidden;
      takeawaysDrawer.hidden = !isHidden;
      toggleTakeawaysBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
  }

  // C. Detección de Enlace Directo desde Videos (#video, #destacados, #paper-video, ?ref=video)
  function checkVideoDeepLink() {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const isVideoRef = hash === '#video' || hash === '#destacados' || hash === '#paper-video' || search.includes('ref=video');

    if (isVideoRef) {
      const targetCard = document.getElementById('paper-video') || document.getElementById('destacados');
      if (targetCard) {
        setTimeout(() => {
          const offset = 90;
          const top = targetCard.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
          targetCard.classList.add('spotlight-glow');
          setTimeout(() => {
            targetCard.classList.remove('spotlight-glow');
          }, 3500);
        }, 200);
      }
    }
  }

  checkVideoDeepLink();
  window.addEventListener('hashchange', checkVideoDeepLink);
}

/**
 * 4. Selector de Idioma Bilingüe (Español / Inglés)
 */
function initLanguageSwitch() {
  const dict = window.translations || (typeof translations !== 'undefined' ? translations : null);
  if (!dict) return;

  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('cv_lang') || 'es';

  function setLanguage(lang) {
    const currentDict = window.translations || dict;
    if (!currentDict || !currentDict[lang]) return;

    // Actualizar atributo lang en html
    document.documentElement.lang = lang;

    // Reemplazar textos con data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (currentDict[lang][key]) {
        el.innerHTML = currentDict[lang][key];
      }
    });

    // Reemplazar placeholders en inputs (Buscador)
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (currentDict[lang][key]) {
        el.setAttribute('placeholder', currentDict[lang][key]);
      }
    });

    // Actualizar botones activos de idioma
    const allBtns = document.querySelectorAll('.lang-btn');
    allBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Guardar preferencia
    localStorage.setItem('cv_lang', lang);
  }

  // Asignar eventos
  langBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Aplicar idioma inicial si se había guardado en sesión previa
  if (savedLang === 'en') {
    setLanguage('en');
  }
}

/**
 * 5. Botón flotante "Volver Arriba" (Back to Top)
 */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
