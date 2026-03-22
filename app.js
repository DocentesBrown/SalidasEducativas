(() => {
  const APP_CONFIG = window.APP_CONFIG || {};
  const FAVORITES_KEY = "db_salidas_favoritas_v1";

  const DEMO_RECORDS = [
    {
      id: "SAL-0001",
      slug: "pereyra-iraola-biologia-4to",
      status: "validado",
      published: true,
      featured: true,
      sort_order: 1,
      title: "Reserva de Biosfera Pereyra Iraola",
      summary: "Salida de campo para analizar ecosistemas, flujo de energía, biodiversidad y relaciones entre ambientes naturales e intervenidos.",
      description: "Propuesta pensada para Biología de 4° año con foco en observación de campo, registro de datos, comparación de ambientes y análisis de agroecosistemas.",
      level: "Secundaria",
      modality: "Común",
      target_grades: "4° año",
      age_range: "15-16",
      subject: "Biología",
      area: "Ciencias Naturales",
      theme_axes: "Ecosistemas, biodiversidad, productividad, agroecosistemas",
      key_contents: "Relaciones tróficas, flujo de energía, intervención humana, observación de campo",
      skills: "Observación, registro, análisis, comparación, trabajo colaborativo",
      interdisciplinary: "Sí",
      associated_subjects: "Geografía, Prácticas del Lenguaje",
      trip_type: "Reserva natural",
      pedagogical_purpose: "Observación e investigación",
      suggested_product: "Cuaderno de campo e informe comparativo",
      destination_name: "Reserva de Biosfera Pereyra Iraola",
      destination_type: "Espacio natural protegido",
      province: "Buenos Aires",
      district: "Berazategui",
      locality: "Pereyra Iraola",
      address: "Camino General Belgrano y Parque Pereyra Iraola",
      latitude: "-34.8418",
      longitude: "-58.0900",
      maps_url: "https://maps.google.com/?q=Pereyra+Iraola",
      environment: "Natural",
      space_format: "Al aire libre",
      duration: "Media jornada",
      seasonality: "Otoño / primavera",
      schedule: "8:00 a 13:00",
      transport: "Micro escolar",
      distance_km: "35",
      cost_band: "Bajo",
      estimated_cost_ars: "0",
      free: true,
      booking_required: true,
      booking_contact: "Completar con contacto institucional",
      capacity: "Hasta 40 estudiantes por grupo",
      accessibility: "A evaluar según recorrido",
      inclusion_support: "Planificar apoyos específicos según grupo",
      organization_complexity: "Media",
      risk_level: "Bajo",
      required_documents: "Autorización familiar, listado de estudiantes, ficha de emergencia",
      recommended_materials: "Cuaderno de campo, agua, protector solar, lápiz, celular/cámara",
      safety_notes: "Circular siempre en grupo y respetar indicaciones del lugar",
      didactic_stage: "Desarrollo de unidad",
      prior_activities: "Lectura de conceptos clave y formulación de hipótesis",
      field_activities: "Recorrido guiado, observación, registro y comparación de sectores",
      post_activities: "Socialización, análisis de datos e informe",
      assessment: "Participación, calidad del registro y producción final",
      curriculum_reference: "Biología 4° año - Unidad 3",
      keywords: "ecosistemas, biodiversidad, reserva, agroecosistemas, salida educativa",
      image_url: "",
      pdf_url: "",
      source_url: "",
      author: "Docentes Brown",
      created_at: "2026-03-22",
      updated_at: "2026-03-22"
    }
  ];

  const state = {
    records: [],
    filtered: [],
    favoritesOnly: false,
    filters: {
      search: "",
      level: "",
      subject: "",
      district: "",
      trip_type: "",
      duration: "",
      cost_band: "",
      environment: "",
      accessibility: "",
      locality: "",
      onlyFree: false,
      onlyFeatured: false,
      publishedOnly: true,
      bookingRequired: false,
      sortBy: "featured",
    },
    sourceMode: "demo",
    favorites: new Set(loadFavorites())
  };

  const els = {
    appTitle: document.getElementById("appTitle"),
    appSubtitle: document.getElementById("appSubtitle"),
    brandName: document.getElementById("brandName"),
    dataSourceBanner: document.getElementById("dataSourceBanner"),
    resultsGrid: document.getElementById("resultsGrid"),
    emptyState: document.getElementById("emptyState"),
    searchInput: document.getElementById("searchInput"),
    resultsTitle: document.getElementById("resultsTitle"),
    activeFilterTags: document.getElementById("activeFilterTags"),
    lastUpdateText: document.getElementById("lastUpdateText"),
    featuredStrip: document.getElementById("featuredStrip"),
    detailModal: document.getElementById("detailModal"),
    modalContent: document.getElementById("modalContent"),
    cardTemplate: document.getElementById("cardTemplate"),
    statResults: document.getElementById("statResults"),
    statFree: document.getElementById("statFree"),
    statFeatured: document.getElementById("statFeatured"),
    filterLevel: document.getElementById("filterLevel"),
    filterSubject: document.getElementById("filterSubject"),
    filterDistrict: document.getElementById("filterDistrict"),
    filterTripType: document.getElementById("filterTripType"),
    filterDuration: document.getElementById("filterDuration"),
    filterCost: document.getElementById("filterCost"),
    filterEnvironment: document.getElementById("filterEnvironment"),
    filterAccessibility: document.getElementById("filterAccessibility"),
    filterLocality: document.getElementById("filterLocality"),
    filterOnlyFree: document.getElementById("filterOnlyFree"),
    filterOnlyFeatured: document.getElementById("filterOnlyFeatured"),
    filterPublished: document.getElementById("filterPublished"),
    filterBooking: document.getElementById("filterBooking"),
    sortBy: document.getElementById("sortBy"),
    quickChips: document.getElementById("quickChips"),
    toggleFiltersBtn: document.getElementById("toggleFiltersBtn"),
    filtersPanel: document.getElementById("filtersPanel"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    shareFiltersBtn: document.getElementById("shareFiltersBtn"),
    showFavoritesBtn: document.getElementById("showFavoritesBtn"),
    closeFiltersBtn: document.getElementById("closeFiltersBtn"),
    filtersBackdrop: document.getElementById("filtersBackdrop")
  };

  const QUICK_CHIPS = [
    { label: "Secundaria", filterKey: "level", value: "Secundaria" },
    { label: "Biología", filterKey: "subject", value: "Biología" },
    { label: "Gratuitas", filterKey: "onlyFree", value: true },
    { label: "Aire libre", filterKey: "environment", value: "Natural" },
    { label: "Media jornada", filterKey: "duration", value: "Media jornada" },
    { label: "Destacadas", filterKey: "onlyFeatured", value: true }
  ];

  init();

  function init() {
    applyBranding();
    bindEvents();
    renderQuickChips();
    hydrateStateFromUrl();
    loadData();
  }

  function applyBranding() {
    document.title = APP_CONFIG.appName || "Biblioteca de Salidas Educativas";
    els.appTitle.textContent = APP_CONFIG.appName || "Biblioteca de Salidas Educativas";
    els.appSubtitle.textContent = APP_CONFIG.subtitle || "Propuestas listas para explorar, adaptar y usar con más rapidez en la escuela.";
    els.brandName.textContent = APP_CONFIG.brandName || "Docentes Brown";
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", debounce((event) => {
      state.filters.search = event.target.value.trim();
      applyFilters();
    }, 180));

    [
      [els.filterLevel, "level"],
      [els.filterSubject, "subject"],
      [els.filterDistrict, "district"],
      [els.filterTripType, "trip_type"],
      [els.filterDuration, "duration"],
      [els.filterCost, "cost_band"],
      [els.filterEnvironment, "environment"],
      [els.filterAccessibility, "accessibility"],
      [els.filterLocality, "locality"],
      [els.sortBy, "sortBy"]
    ].forEach(([element, key]) => {
      element.addEventListener("change", (event) => {
        state.filters[key] = event.target.value;
        applyFilters();
        if (window.innerWidth <= 1080 && key !== "sortBy") closeFiltersPanel();
      });
    });

    [
      [els.filterOnlyFree, "onlyFree"],
      [els.filterOnlyFeatured, "onlyFeatured"],
      [els.filterPublished, "publishedOnly"],
      [els.filterBooking, "bookingRequired"]
    ].forEach(([element, key]) => {
      element.addEventListener("change", (event) => {
        state.filters[key] = event.target.checked;
        applyFilters();
        if (window.innerWidth <= 1080) closeFiltersPanel();
      });
    });

    els.resetFiltersBtn.addEventListener("click", resetFilters);
    els.emptyResetBtn.addEventListener("click", resetFilters);
    els.closeModalBtn.addEventListener("click", () => els.detailModal.close());
    els.toggleFiltersBtn.addEventListener("click", () => {
      if (window.innerWidth <= 1080) {
        openFiltersPanel();
      } else {
        els.filtersPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    els.closeFiltersBtn?.addEventListener("click", closeFiltersPanel);
    els.filtersBackdrop?.addEventListener("click", closeFiltersPanel);
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) closeFiltersPanel();
    });
    els.shareFiltersBtn.addEventListener("click", copyShareUrl);
    els.showFavoritesBtn.addEventListener("click", () => {
      state.favoritesOnly = !state.favoritesOnly;
      els.showFavoritesBtn.textContent = state.favoritesOnly ? "Ver todas" : "Ver favoritas";
      applyFilters();
    });

    els.detailModal.addEventListener("click", (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickedOutside = (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
      if (clickedOutside) els.detailModal.close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeFiltersPanel();
    });
  }

  async function loadData() {
    setLoadingState(true);
    try {
      let records = [];
      if (APP_CONFIG.csvUrl) {
        records = await loadFromCsv(APP_CONFIG.csvUrl);
        state.sourceMode = "csv";
      } else if (APP_CONFIG.spreadsheetId) {
        records = await loadFromGoogleSheets(APP_CONFIG.spreadsheetId, APP_CONFIG.sheetName || "salidas");
        state.sourceMode = "gviz";
      } else {
        records = DEMO_RECORDS;
        state.sourceMode = "demo";
      }

      state.records = records.map(normalizeRecord).filter(Boolean);
      if (!state.records.length) {
        state.records = DEMO_RECORDS.map(normalizeRecord);
        state.sourceMode = "demo-empty";
      }

      populateFilters(state.records);
      applyFilters();
      renderSourceBanner();
    } catch (error) {
      console.error("Error al cargar datos:", error);
      state.records = DEMO_RECORDS.map(normalizeRecord);
      state.sourceMode = "demo-error";
      populateFilters(state.records);
      applyFilters();
      renderSourceBanner(error);
    } finally {
      setLoadingState(false);
    }
  }

  async function loadFromGoogleSheets(spreadsheetId, sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudo leer Google Sheets (${response.status})`);
    const text = await response.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    const cols = json.table.cols.map((col) => col.label || col.id || "");
    const rows = json.table.rows.map((row) => {
      const obj = {};
      cols.forEach((col, index) => {
        obj[col] = row.c[index] ? row.c[index].v : "";
      });
      return obj;
    });
    return rows;
  }

  async function loadFromCsv(csvUrl) {
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`No se pudo leer CSV (${response.status})`);
    const text = await response.text();
    return parseCsv(text);
  }

  function normalizeRecord(raw) {
    if (!raw || !raw.title) return null;
    const record = { ...raw };
    const numberFields = ["sort_order", "estimated_cost_ars", "distance_km", "latitude", "longitude"];
    numberFields.forEach((field) => {
      record[field] = toNumber(record[field]);
    });
    record.published = toBoolean(record.published);
    record.featured = toBoolean(record.featured);
    record.free = toBoolean(record.free);
    record.booking_required = toBoolean(record.booking_required);
    record.interdisciplinary = normalizeText(record.interdisciplinary);
    record.updated_at = record.updated_at || record.created_at || "";
    record.keywords_list = splitList(record.keywords);
    record.skills_list = splitList(record.skills);
    record.theme_axes_list = splitList(record.theme_axes);
    record.location_label = [record.locality, record.district, record.province].filter(Boolean).join(" · ");
    record.cost_label = record.free ? "Gratuita" : (record.cost_band || (record.estimated_cost_ars ? "Con costo" : "A definir"));
    record.summary = record.summary || record.description || "Sin resumen todavía.";
    return record;
  }

  function populateFilters(records) {
    const maps = {
      level: uniqueSorted(records.map((item) => item.level)),
      subject: uniqueSorted(records.map((item) => item.subject)),
      district: uniqueSorted(records.map((item) => item.district)),
      trip_type: uniqueSorted(records.map((item) => item.trip_type)),
      duration: uniqueSorted(records.map((item) => item.duration)),
      cost_band: uniqueSorted(records.map((item) => item.cost_band || item.cost_label)),
      environment: uniqueSorted(records.map((item) => item.environment)),
      accessibility: uniqueSorted(records.map((item) => item.accessibility)),
      locality: uniqueSorted(records.map((item) => item.locality)),
    };

    setSelectOptions(els.filterLevel, maps.level, "Todos los niveles");
    setSelectOptions(els.filterSubject, maps.subject, "Todas las materias");
    setSelectOptions(els.filterDistrict, maps.district, "Todos los distritos");
    setSelectOptions(els.filterTripType, maps.trip_type, "Todos los tipos");
    setSelectOptions(els.filterDuration, maps.duration, "Todas las duraciones");
    setSelectOptions(els.filterCost, maps.cost_band, "Todos los costos");
    setSelectOptions(els.filterEnvironment, maps.environment, "Todos los entornos");
    setSelectOptions(els.filterAccessibility, maps.accessibility, "Todas las opciones");
    setSelectOptions(els.filterLocality, maps.locality, "Todas las localidades");

    syncControlsFromState();
  }

  function applyFilters() {
    let results = [...state.records];
    const filters = state.filters;
    const search = normalizeText(filters.search);

    if (search) {
      results = results.filter((item) => {
        const haystack = normalizeText([
          item.title,
          item.summary,
          item.subject,
          item.area,
          item.theme_axes,
          item.key_contents,
          item.destination_name,
          item.destination_type,
          item.locality,
          item.district,
          item.keywords,
          item.level,
          item.trip_type
        ].join(" "));
        return haystack.includes(search);
      });
    }

    const exactMatchKeys = ["level", "subject", "district", "trip_type", "duration", "environment", "accessibility", "locality"];
    exactMatchKeys.forEach((key) => {
      if (filters[key]) {
        results = results.filter((item) => normalizeText(item[key]) === normalizeText(filters[key]));
      }
    });

    if (filters.cost_band) {
      results = results.filter((item) => normalizeText(item.cost_band || item.cost_label) === normalizeText(filters.cost_band));
    }
    if (filters.onlyFree) results = results.filter((item) => item.free);
    if (filters.onlyFeatured) results = results.filter((item) => item.featured);
    if (filters.publishedOnly) results = results.filter((item) => item.published);
    if (filters.bookingRequired) results = results.filter((item) => item.booking_required);
    if (state.favoritesOnly) results = results.filter((item) => state.favorites.has(String(item.id)));

    state.filtered = sortRecords(results, filters.sortBy);

    renderActiveFilters();
    renderFeatured();
    renderResults();
    updateStats();
    updateLastSync();
    syncUrlState();
    updateQuickChipStates();
  }

  function openFiltersPanel() {
    els.filtersPanel.classList.add("is-open");
    document.body.classList.add("filters-open");
  }

  function closeFiltersPanel() {
    els.filtersPanel.classList.remove("is-open");
    document.body.classList.remove("filters-open");
  }

  function renderResults() {
    els.resultsGrid.innerHTML = "";
    const results = state.filtered;
    els.resultsTitle.textContent = state.favoritesOnly ? "Tus salidas favoritas" : `${results.length} salida${results.length === 1 ? "" : "s"} para explorar`;

    if (!results.length) {
      els.emptyState.classList.remove("hidden");
      return;
    }

    els.emptyState.classList.add("hidden");

    results.forEach((record) => {
      const fragment = els.cardTemplate.content.cloneNode(true);
      const card = fragment.querySelector(".trip-card");
      const badgesWrap = fragment.querySelector(".trip-card__badges");
      const title = fragment.querySelector(".trip-card__title");
      const summary = fragment.querySelector(".trip-card__summary");
      const meta = fragment.querySelector(".trip-card__meta");
      const openBtn = fragment.querySelector(".trip-card__open");
      const pdfBtn = fragment.querySelector(".trip-card__pdf");
      const favoriteBtn = fragment.querySelector(".favorite-btn");

      createBadges(record).forEach((badge) => badgesWrap.appendChild(badge));
      title.textContent = record.title;
      summary.textContent = record.summary;

      [
        record.subject,
        record.target_grades,
        record.location_label,
        record.trip_type,
        record.duration,
        record.cost_label
      ].filter(Boolean).forEach((value) => {
        meta.appendChild(createMetaPill(value));
      });

      if (record.pdf_url) {
        pdfBtn.href = record.pdf_url;
        pdfBtn.classList.remove("hidden");
      }

      openBtn.addEventListener("click", () => openDetail(record));
      favoriteBtn.addEventListener("click", () => toggleFavorite(record.id, favoriteBtn));
      paintFavoriteButton(favoriteBtn, record.id);
      card.dataset.id = record.id;
      els.resultsGrid.appendChild(fragment);
    });
  }

  function renderFeatured() {
    const featured = state.filtered.filter((item) => item.featured).slice(0, 6);
    els.featuredStrip.innerHTML = "";
    if (!featured.length || state.favoritesOnly) {
      els.featuredStrip.classList.add("hidden");
      return;
    }

    featured.forEach((record) => {
      const article = document.createElement("article");
      article.className = "featured-card";
      article.innerHTML = `
        <span class="badge badge--soft">Destacada</span>
        <h3>${escapeHtml(record.title)}</h3>
        <p>${escapeHtml(record.summary)}</p>
        <button class="btn btn--ghost btn--small" type="button">Abrir ficha</button>
      `;
      article.querySelector("button").addEventListener("click", () => openDetail(record));
      els.featuredStrip.appendChild(article);
    });

    els.featuredStrip.classList.remove("hidden");
  }

  function openDetail(record) {
    closeFiltersPanel();
    const tags = [record.level, record.subject, record.target_grades, record.trip_type, record.duration, record.cost_label].filter(Boolean);
    const sections = [
      { title: "Propósito pedagógico", content: record.pedagogical_purpose || "No especificado." },
      { title: "Contenidos clave", content: record.key_contents || "No especificado." },
      { title: "Actividades previas", content: record.prior_activities || "No especificado." },
      { title: "Actividades en campo", content: record.field_activities || "No especificado." },
      { title: "Actividades posteriores", content: record.post_activities || "No especificado." },
      { title: "Evaluación / producto", content: [record.assessment, record.suggested_product].filter(Boolean).join(" · ") || "No especificado." },
    ];

    const infoBoxes = [
      ["Destino", [record.destination_name, record.destination_type].filter(Boolean).join(" · ") || "Sin dato"],
      ["Ubicación", record.location_label || record.address || "Sin dato"],
      ["Horario sugerido", record.schedule || "A definir"],
      ["Transporte", record.transport || "A definir"],
      ["Documentación", record.required_documents || "A definir"],
      ["Seguridad", record.safety_notes || "A definir"],
      ["Accesibilidad", record.accessibility || "A evaluar"],
      ["Complejidad / riesgo", [record.organization_complexity, record.risk_level].filter(Boolean).join(" · ") || "No especificado"],
    ];

    els.modalContent.innerHTML = `
      <header class="modal__header">
        <div class="modal__tags">${tags.map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}</div>
        <h2>${escapeHtml(record.title)}</h2>
        <p class="modal__lead">${escapeHtml(record.description || record.summary)}</p>
        <div class="modal__actions">
          ${record.pdf_url ? `<a class="btn btn--primary" href="${escapeAttr(record.pdf_url)}" target="_blank" rel="noopener noreferrer">Abrir PDF</a>` : ""}
          ${record.maps_url ? `<a class="btn btn--ghost" href="${escapeAttr(record.maps_url)}" target="_blank" rel="noopener noreferrer">Abrir mapa</a>` : ""}
          ${record.source_url ? `<a class="btn btn--ghost" href="${escapeAttr(record.source_url)}" target="_blank" rel="noopener noreferrer">Fuente</a>` : ""}
        </div>
      </header>

      <section class="modal__grid">
        ${infoBoxes.map(([label, value]) => `
          <article class="modal__box">
            <h3>${escapeHtml(label)}</h3>
            <p>${escapeHtml(value)}</p>
          </article>
        `).join("")}
      </section>

      ${sections.map((section) => `
        <section class="modal__section">
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.content)}</p>
        </section>
      `).join("")}

      <section class="modal__section">
        <h3>Referencia curricular y temas</h3>
        <p>${escapeHtml([record.curriculum_reference, record.theme_axes, record.skills].filter(Boolean).join(" · ") || "No especificado.")}</p>
      </section>

      <section class="modal__section">
        <h3>Materiales recomendados</h3>
        <p>${escapeHtml(record.recommended_materials || "No especificado.")}</p>
      </section>

      <section class="modal__section">
        <h3>Reserva y contacto</h3>
        <p>${escapeHtml(record.booking_contact || (record.booking_required ? "Completar con datos institucionales del destino." : "No requiere reserva previa."))}</p>
      </section>
    `;

    els.detailModal.showModal();
  }

  function renderActiveFilters() {
    const tags = [];
    Object.entries(state.filters).forEach(([key, value]) => {
      if (!value) return;
      if (typeof value === "boolean" && !value) return;
      if (key === "sortBy") return;
      const label = filterLabel(key, value);
      tags.push(label);
    });
    if (state.favoritesOnly) tags.push("Solo favoritas");

    els.activeFilterTags.innerHTML = tags.length
      ? tags.map((tag) => `<span class="filter-tag">${escapeHtml(tag)}</span>`).join("")
      : `<span class="filter-tag">Sin filtros activos</span>`;
  }

  function renderQuickChips() {
    els.quickChips.innerHTML = "";
    QUICK_CHIPS.forEach((chip) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quick-chip badge";
      button.textContent = chip.label;
      button.dataset.filterKey = chip.filterKey;
      button.dataset.value = String(chip.value);
      button.addEventListener("click", () => {
        const current = state.filters[chip.filterKey];
        if (typeof chip.value === "boolean") {
          state.filters[chip.filterKey] = current === chip.value ? false : chip.value;
        } else {
          state.filters[chip.filterKey] = normalizeText(current) === normalizeText(chip.value) ? "" : chip.value;
        }
        syncControlsFromState();
        applyFilters();
        if (window.innerWidth <= 1080) closeFiltersPanel();
      });
      els.quickChips.appendChild(button);
    });
    updateQuickChipStates();
  }

  function updateQuickChipStates() {
    [...els.quickChips.children].forEach((button) => {
      const key = button.dataset.filterKey;
      const value = button.dataset.value;
      const active = typeof state.filters[key] === "boolean"
        ? String(state.filters[key]) === value
        : normalizeText(state.filters[key]) === normalizeText(value);
      button.classList.toggle("is-active", active);
    });
  }

  function updateStats() {
    els.statResults.textContent = String(state.filtered.length);
    els.statFree.textContent = String(state.filtered.filter((item) => item.free).length);
    els.statFeatured.textContent = String(state.filtered.filter((item) => item.featured).length);
  }

  function updateLastSync() {
    const latest = state.records
      .map((item) => item.updated_at)
      .filter(Boolean)
      .sort()
      .reverse()[0];
    els.lastUpdateText.textContent = latest
      ? `Última actualización detectada: ${formatDate(latest)}`
      : "Última actualización: sin dato";
  }

  function renderSourceBanner(error) {
    const messages = {
      demo: "Estás viendo la versión demo. Para conectar Google Sheets, pegá el ID de tu hoja en config.js.",
      "demo-empty": "La hoja se leyó, pero no devolvió salidas válidas. Se muestra una demo para que la UI no quede vacía.",
      "demo-error": `No se pudo leer Google Sheets y se activó una demo local.${error ? ` Detalle: ${error.message}` : ""}`,
      csv: "Conectado a un CSV publicado de Google Sheets.",
      gviz: `Conectado a Google Sheets: hoja “${APP_CONFIG.sheetName || "salidas"}”.`
    };

    const message = messages[state.sourceMode];
    if (!message) {
      els.dataSourceBanner.classList.add("hidden");
      return;
    }

    els.dataSourceBanner.textContent = message;
    els.dataSourceBanner.classList.remove("hidden");
  }

  function setLoadingState(isLoading) {
    els.resultsGrid.innerHTML = isLoading
      ? Array.from({ length: 4 }, () => `
          <article class="trip-card card">
            <div class="badge">Cargando…</div>
            <h3 class="trip-card__title">Sincronizando biblioteca</h3>
            <p class="trip-card__summary">Estamos trayendo las salidas educativas desde la hoja.</p>
          </article>
        `).join("")
      : "";
  }

  function sortRecords(records, sortBy) {
    const items = [...records];
    switch (sortBy) {
      case "updated_desc":
        return items.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
      case "title_asc":
        return items.sort((a, b) => String(a.title).localeCompare(String(b.title), "es"));
      case "cost_asc":
        return items.sort((a, b) => (a.estimated_cost_ars || 0) - (b.estimated_cost_ars || 0));
      case "featured":
      default:
        return items.sort((a, b) => {
          if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
          return (a.sort_order || 9999) - (b.sort_order || 9999);
        });
    }
  }

  function setSelectOptions(select, values, placeholder) {
    const current = select.value;
    select.innerHTML = [`<option value="">${escapeHtml(placeholder)}</option>`]
      .concat(values.map((value) => `<option value="${escapeAttr(value)}">${escapeHtml(value)}</option>`))
      .join("");
    select.value = current && values.includes(current) ? current : (state.filters[selectToStateKey(select.id)] || "");
  }

  function createBadges(record) {
    const badges = [];
    if (record.featured) badges.push(createBadge("Destacada", "warm"));
    if (record.free) badges.push(createBadge("Gratuita", "accent"));
    if (record.booking_required) badges.push(createBadge("Con reserva", ""));
    if (record.published) badges.push(createBadge("Publicada", ""));
    return badges;
  }

  function createBadge(text, modifier = "") {
    const span = document.createElement("span");
    span.className = `badge${modifier ? ` badge--${modifier}` : ""}`;
    span.textContent = text;
    return span;
  }

  function createMetaPill(text) {
    const span = document.createElement("span");
    span.className = "meta-pill";
    span.textContent = text;
    return span;
  }

  function toggleFavorite(id, button) {
    const key = String(id);
    if (state.favorites.has(key)) {
      state.favorites.delete(key);
    } else {
      state.favorites.add(key);
    }
    saveFavorites([...state.favorites]);
    paintFavoriteButton(button, id);
    if (state.favoritesOnly) applyFilters();
  }

  function paintFavoriteButton(button, id) {
    const active = state.favorites.has(String(id));
    button.classList.toggle("is-favorite", active);
    button.textContent = active ? "♥" : "♡";
  }

  function resetFilters() {
    state.filters = {
      search: "",
      level: "",
      subject: "",
      district: "",
      trip_type: "",
      duration: "",
      cost_band: "",
      environment: "",
      accessibility: "",
      locality: "",
      onlyFree: false,
      onlyFeatured: false,
      publishedOnly: true,
      bookingRequired: false,
      sortBy: "featured",
    };
    state.favoritesOnly = false;
    els.showFavoritesBtn.textContent = "Ver favoritas";
    syncControlsFromState();
    applyFilters();
    closeFiltersPanel();
  }

  function syncControlsFromState() {
    els.searchInput.value = state.filters.search;
    els.filterLevel.value = state.filters.level;
    els.filterSubject.value = state.filters.subject;
    els.filterDistrict.value = state.filters.district;
    els.filterTripType.value = state.filters.trip_type;
    els.filterDuration.value = state.filters.duration;
    els.filterCost.value = state.filters.cost_band;
    els.filterEnvironment.value = state.filters.environment;
    els.filterAccessibility.value = state.filters.accessibility;
    els.filterLocality.value = state.filters.locality;
    els.filterOnlyFree.checked = state.filters.onlyFree;
    els.filterOnlyFeatured.checked = state.filters.onlyFeatured;
    els.filterPublished.checked = state.filters.publishedOnly;
    els.filterBooking.checked = state.filters.bookingRequired;
    els.sortBy.value = state.filters.sortBy;
  }

  function copyShareUrl() {
    const url = new URL(window.location.href);
    syncUrlState(url);
    navigator.clipboard.writeText(url.toString())
      .then(() => {
        const original = els.shareFiltersBtn.textContent;
        els.shareFiltersBtn.textContent = "Link copiado";
        setTimeout(() => { els.shareFiltersBtn.textContent = original; }, 1200);
      })
      .catch(() => {
        alert("No se pudo copiar el link. Podés copiar la URL manualmente.");
      });
  }

  function hydrateStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["search", "level", "subject", "district", "trip_type", "duration", "cost_band", "environment", "accessibility", "locality", "sortBy"];
    keys.forEach((key) => {
      if (params.has(key)) state.filters[key] = params.get(key) || "";
    });
    ["onlyFree", "onlyFeatured", "publishedOnly", "bookingRequired", "favoritesOnly"].forEach((key) => {
      if (params.has(key)) {
        const value = params.get(key) === "true";
        if (key === "favoritesOnly") state.favoritesOnly = value;
        else state.filters[key] = value;
      }
    });
    syncControlsFromState();
    els.showFavoritesBtn.textContent = state.favoritesOnly ? "Ver todas" : "Ver favoritas";
  }

  function syncUrlState(url = new URL(window.location.href)) {
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value === "" || value === false) url.searchParams.delete(key);
      else url.searchParams.set(key, String(value));
    });
    if (state.favoritesOnly) url.searchParams.set("favoritesOnly", "true");
    else url.searchParams.delete("favoritesOnly");
    window.history.replaceState({}, "", url);
  }

  function filterLabel(key, value) {
    const labels = {
      search: `Búsqueda: ${value}`,
      level: `Nivel: ${value}`,
      subject: `Materia: ${value}`,
      district: `Distrito: ${value}`,
      trip_type: `Tipo: ${value}`,
      duration: `Duración: ${value}`,
      cost_band: `Costo: ${value}`,
      environment: `Entorno: ${value}`,
      accessibility: `Accesibilidad: ${value}`,
      locality: `Localidad: ${value}`,
      onlyFree: "Solo gratuitas",
      onlyFeatured: "Solo destacadas",
      publishedOnly: "Solo publicadas",
      bookingRequired: "Con reserva previa"
    };
    return labels[key] || String(value);
  }

  function selectToStateKey(id) {
    const map = {
      filterLevel: "level",
      filterSubject: "subject",
      filterDistrict: "district",
      filterTripType: "trip_type",
      filterDuration: "duration",
      filterCost: "cost_band",
      filterEnvironment: "environment",
      filterAccessibility: "accessibility",
      filterLocality: "locality"
    };
    return map[id] || "";
  }

  function parseCsv(text) {
    const rows = [];
    let current = "";
    let row = [];
    let insideQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"') {
        if (insideQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(current);
        current = "";
      } else if ((char === '\n' || char === '\r') && !insideQuotes) {
        if (char === '\r' && next === '\n') i += 1;
        row.push(current);
        if (row.some((cell) => cell !== "")) rows.push(row);
        row = [];
        current = "";
      } else {
        current += char;
      }
    }
    if (current || row.length) {
      row.push(current);
      rows.push(row);
    }

    const [headers, ...dataRows] = rows;
    if (!headers) return [];
    return dataRows.map((dataRow) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = dataRow[index] || "";
      });
      return obj;
    });
  }

  function loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveFavorites(ids) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "es"));
  }

  function splitList(value) {
    return String(value || "")
      .split(/[|,;]+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function toNumber(value) {
    if (value === null || value === undefined || value === "") return 0;
    const normalized = String(value).replace(/\./g, "").replace(",", ".");
    const num = Number(normalized);
    return Number.isFinite(num) ? num : 0;
  }

  function toBoolean(value) {
    if (typeof value === "boolean") return value;
    return ["true", "1", "si", "sí", "yes", "publicada", "publicado", "x"].includes(normalizeText(value));
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(date);
  }

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/`/g, "&#96;");
  }

  function debounce(fn, wait = 200) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }
})();
