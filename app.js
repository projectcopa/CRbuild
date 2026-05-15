/* ===========================
   CVCraft Pro — app.js
   =========================== */

// ===== STATE =====
let currentTemplate = 'modern-executive';
let currentZoom = 0.85;
let currentColor = '#2563EB';
let currentFont = "'DM Sans', sans-serif";
let currentFontSize = 11;
let currentLayout = 'sidebar';
let currentTheme = 'light';
let aiOption = 'objective';
let autoSaveTimer = null;
let entryCounters = { experience: 0, education: 0, certifications: 0, references: 0 };
let photoBase64 = null;

// ===== COLOR PALETTES =====
const colorPalettes = [
  { name: 'Royal Blue',    primary: '#2563EB', sidebar: '#1D4ED8', accent: '#DBEAFE' },
  { name: 'Emerald',       primary: '#059669', sidebar: '#047857', accent: '#D1FAE5' },
  { name: 'Slate',         primary: '#334155', sidebar: '#1E293B', accent: '#E2E8F0' },
  { name: 'Rose Gold',     primary: '#BE185D', sidebar: '#9D174D', accent: '#FCE7F3' },
  { name: 'Amber',         primary: '#D97706', sidebar: '#B45309', accent: '#FEF3C7' },
  { name: 'Violet',        primary: '#7C3AED', sidebar: '#6D28D9', accent: '#EDE9FE' },
  { name: 'Teal',          primary: '#0F766E', sidebar: '#0D6259', accent: '#CCFBF1' },
  { name: 'Crimson',       primary: '#DC2626', sidebar: '#B91C1C', accent: '#FEE2E2' },
];

// ===== TEMPLATES DATA =====
const templates = [
  { id: 'modern-executive', name: 'Modern Executive', tags: ['cv','professional'], label: 'Popular', layout: 'sidebar', colors: { primary: '#2563EB', sidebar: '#1D4ED8', accent: '#DBEAFE' } },
  { id: 'clean-minimal',    name: 'Clean Minimal',    tags: ['resume','professional'], label: null,      layout: 'classic', colors: { primary: '#334155', sidebar: '#1E293B', accent: '#E2E8F0' } },
  { id: 'creative-bold',    name: 'Creative Bold',    tags: ['cv','fresher'], label: 'Trending',  layout: 'modern',  colors: { primary: '#7C3AED', sidebar: '#6D28D9', accent: '#EDE9FE' } },
  { id: 'elegant-serif',    name: 'Elegant Serif',    tags: ['cv','professional'], label: null,      layout: 'sidebar', colors: { primary: '#BE185D', sidebar: '#9D174D', accent: '#FCE7F3' } },
  { id: 'tech-dark',        name: 'Tech Dark',        tags: ['resume','professional'], label: 'Special',   layout: 'modern',  colors: { primary: '#059669', sidebar: '#047857', accent: '#D1FAE5' } },
  { id: 'fresher-bright',   name: 'Fresher Bright',   tags: ['cv','fresher'], label: 'Trending',  layout: 'classic', colors: { primary: '#D97706', sidebar: '#B45309', accent: '#FEF3C7' } },
  { id: 'bio-data-classic', name: 'Bio-Data Classic', tags: ['bio'], label: null,      layout: 'sidebar', colors: { primary: '#0F766E', sidebar: '#0D6259', accent: '#CCFBF1' } },
  { id: 'corporate-sharp',  name: 'Corporate Sharp',  tags: ['cv','professional'], label: null,      layout: 'classic', colors: { primary: '#1E3A5F', sidebar: '#152D4A', accent: '#DBEAFE' } },
  { id: 'startup-modern',   name: 'Startup Modern',   tags: ['resume','fresher'], label: 'Trending',  layout: 'modern',  colors: { primary: '#DC2626', sidebar: '#B91C1C', accent: '#FEE2E2' } },
  { id: 'academic-formal',  name: 'Academic Formal',  tags: ['cv'], label: null,      layout: 'classic', colors: { primary: '#374151', sidebar: '#1F2937', accent: '#F3F4F6' } },
  { id: 'designer-split',   name: 'Designer Split',   tags: ['resume','professional'], label: 'Special',   layout: 'sidebar', colors: { primary: '#6D28D9', sidebar: '#5B21B6', accent: '#F5F3FF' } },
  { id: 'nurse-medical',    name: 'Medical Pro',       tags: ['cv','professional'], label: null,      layout: 'classic', colors: { primary: '#0E7490', sidebar: '#0C6172', accent: '#E0F7FA' } },
  { id: 'finance-pro',      name: 'Finance Pro',      tags: ['cv','professional'], label: null,      layout: 'sidebar', colors: { primary: '#1F2937', sidebar: '#111827', accent: '#D1FAE5' } },
  { id: 'teacher-edu',      name: 'Teacher Edition',  tags: ['cv','fresher'], label: null,      layout: 'classic', colors: { primary: '#B45309', sidebar: '#92400E', accent: '#FEF3C7' } },
  { id: 'bio-marriage',     name: 'Marriage Bio-Data', tags: ['bio'], label: 'Special',   layout: 'sidebar', colors: { primary: '#BE185D', sidebar: '#9D174D', accent: '#FCE7F3' } },
  { id: 'infographic-cv',   name: 'Infographic CV',   tags: ['cv','fresher'], label: 'Trending',  layout: 'modern',  colors: { primary: '#7C3AED', sidebar: '#5B21B6', accent: '#EDE9FE' } },
  { id: 'two-column',       name: 'Two Column',       tags: ['resume','professional'], label: null,      layout: 'sidebar', colors: { primary: '#065F46', sidebar: '#064E3B', accent: '#D1FAE5' } },
  { id: 'monochrome-pro',   name: 'Monochrome Pro',   tags: ['resume','professional'], label: null,      layout: 'classic', colors: { primary: '#111827', sidebar: '#030712', accent: '#F9FAFB' } },
  { id: 'pastel-creative',  name: 'Pastel Creative',  tags: ['cv','fresher'], label: null,      layout: 'modern',  colors: { primary: '#DB2777', sidebar: '#BE185D', accent: '#FDF2F8' } },
  { id: 'executive-photo',  name: 'Executive + Photo', tags: ['cv','professional'], label: 'Popular',   layout: 'sidebar', colors: { primary: '#1E40AF', sidebar: '#1D3461', accent: '#EFF6FF' } },
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderTemplateGrid('templateGrid', templates);
  renderTemplateGrid('trendingGrid', templates.filter(t => t.label === 'Trending'));
  renderTemplateGrid('specialGrid', templates.filter(t => t.label === 'Special'));
  renderColorPalettes();
  loadSavedData();
  addDefaultEntries();
  setupNavScroll();
});

// ===== NAV SCROLL =====
function setupNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.4)' : '';
  });
}

// ===== PAGE NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const link = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (link) link.classList.add('active');
  document.getElementById('mainFooter').style.display = 'block';
  window.scrollTo(0, 0);
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}

// ===== TEMPLATE RENDERING =====
function renderTemplateGrid(containerId, tpls) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = tpls.map(t => createTemplateCard(t)).join('');
}

function createTemplateCard(t) {
  const tagHTML = t.tags.map(tag => `<span class="template-tag tag-${tag}">${tag.toUpperCase()}</span>`).join('');
  const labelHTML = t.label ? `<div class="template-label">${t.label}</div>` : '';
  return `
    <div class="template-card" onclick="openEditor('${t.id}')">
      ${labelHTML}
      <div class="template-thumb" style="background: ${t.colors.accent}">
        <div class="template-preview-mini" style="background: white; border: 1px solid #e5e7eb;">
          ${renderMiniCV(t)}
        </div>
        <div class="template-overlay">
          <button class="template-use-btn">Use Template →</button>
        </div>
      </div>
      <div class="template-info">
        <div class="template-name">${t.name}</div>
        <div class="template-tags">${tagHTML}</div>
      </div>
    </div>
  `;
}

function renderMiniCV(t) {
  const c = t.colors;
  if (t.layout === 'sidebar') {
    return `<div style="display:flex;height:100%;font-size:5px;font-family:sans-serif">
      <div style="width:40%;background:${c.primary};padding:8px 6px;color:white">
        <div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.3);margin:0 auto 6px"></div>
        <div style="background:rgba(255,255,255,0.4);height:5px;border-radius:2px;margin-bottom:3px"></div>
        <div style="background:rgba(255,255,255,0.25);height:3px;border-radius:2px;margin-bottom:12px;width:70%"></div>
        <div style="background:rgba(255,255,255,0.6);height:3px;border-radius:2px;margin-bottom:4px;width:60%"></div>
        <div style="background:rgba(255,255,255,0.3);height:2px;border-radius:2px;margin-bottom:2px"></div>
        <div style="background:rgba(255,255,255,0.3);height:2px;border-radius:2px;margin-bottom:2px;width:80%"></div>
      </div>
      <div style="flex:1;padding:8px 6px">
        <div style="height:3px;background:#e5e7eb;border-radius:2px;margin-bottom:2px"></div>
        <div style="height:3px;background:#e5e7eb;border-radius:2px;margin-bottom:2px;width:70%"></div>
        <div style="height:2px;background:#f3f4f6;border-radius:2px;margin-bottom:8px;width:50%"></div>
        <div style="height:2px;background:${c.primary};border-radius:2px;margin-bottom:4px;width:40%"></div>
        <div style="height:2px;background:#e5e7eb;border-radius:2px;margin-bottom:2px"></div>
        <div style="height:2px;background:#e5e7eb;border-radius:2px;margin-bottom:2px;width:80%"></div>
        <div style="height:2px;background:#e5e7eb;border-radius:2px;margin-bottom:8px;width:60%"></div>
        <div style="height:2px;background:${c.primary};border-radius:2px;margin-bottom:4px;width:40%"></div>
        <div style="height:2px;background:#e5e7eb;border-radius:2px;margin-bottom:2px"></div>
        <div style="height:2px;background:#e5e7eb;border-radius:2px;margin-bottom:2px;width:70%"></div>
      </div>
    </div>`;
  } else if (t.layout === 'modern') {
    return `<div style="height:100%;font-family:sans-serif">
      <div style="background:${c.primary};padding:10px 8px;color:white">
        <div style="background:rgba(255,255,255,0.4);height:6px;border-radius:2px;margin-bottom:3px;width:60%"></div>
        <div style="background:rgba(255,255,255,0.25);height:3px;border-radius:2px;width:40%"></div>
      </div>
      <div style="padding:8px 6px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div>
            <div style="height:2px;background:${c.primary};border-radius:2px;margin-bottom:4px;width:50%"></div>
            <div style="height:2px;background:#e5e7eb;margin-bottom:2px;border-radius:2px"></div>
            <div style="height:2px;background:#e5e7eb;margin-bottom:2px;border-radius:2px;width:80%"></div>
            <div style="height:2px;background:#e5e7eb;margin-bottom:8px;border-radius:2px;width:60%"></div>
          </div>
          <div>
            <div style="height:2px;background:${c.primary};border-radius:2px;margin-bottom:4px;width:50%"></div>
            <div style="display:flex;gap:2px;flex-wrap:wrap">
              <div style="background:${c.accent};border-radius:2px;height:5px;width:20px"></div>
              <div style="background:${c.accent};border-radius:2px;height:5px;width:16px"></div>
              <div style="background:${c.accent};border-radius:2px;height:5px;width:18px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  } else {
    return `<div style="padding:8px 6px;height:100%;font-family:sans-serif">
      <div style="border-bottom:2px solid ${c.primary};padding-bottom:6px;margin-bottom:6px;display:flex;gap:6px;align-items:center">
        <div style="width:20px;height:20px;border-radius:50%;background:${c.accent};flex-shrink:0"></div>
        <div>
          <div style="background:#1f2937;height:4px;border-radius:2px;margin-bottom:2px;width:60px"></div>
          <div style="background:#6b7280;height:2px;border-radius:2px;width:40px"></div>
        </div>
      </div>
      <div style="height:2px;background:${c.primary};border-radius:2px;margin-bottom:4px;width:35%"></div>
      <div style="height:2px;background:#e5e7eb;margin-bottom:2px;border-radius:2px"></div>
      <div style="height:2px;background:#e5e7eb;margin-bottom:2px;border-radius:2px;width:80%"></div>
      <div style="height:2px;background:#e5e7eb;margin-bottom:8px;border-radius:2px;width:65%"></div>
      <div style="height:2px;background:${c.primary};border-radius:2px;margin-bottom:4px;width:35%"></div>
      <div style="height:2px;background:#e5e7eb;margin-bottom:2px;border-radius:2px"></div>
      <div style="height:2px;background:#e5e7eb;margin-bottom:2px;border-radius:2px;width:75%"></div>
    </div>`;
  }
}

// ===== FILTER TEMPLATES =====
function filterTemplates(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = category === 'all' ? templates : templates.filter(t => t.tags.includes(category));
  renderTemplateGrid('templateGrid', filtered);
}

// ===== OPEN / CLOSE EDITOR =====
function openEditor(templateId) {
  currentTemplate = templateId;
  const tpl = templates.find(t => t.id === templateId) || templates[0];
  document.getElementById('editorTemplateName').textContent = tpl.name;
  document.getElementById('editorModal').classList.add('open');
  document.getElementById('mainFooter').style.display = 'none';
  document.body.style.overflow = 'hidden';

  // Apply template colors
  const palette = colorPalettes.find(p => p.primary === tpl.colors.primary) || colorPalettes[0];
  currentColor = tpl.colors.primary;
  currentLayout = tpl.layout;

  applyLayout(tpl.layout);
  applyZoom(currentZoom);
  updatePreview();
  highlightActiveColor();
}

function closeEditor() {
  document.getElementById('editorModal').classList.remove('open');
  document.getElementById('mainFooter').style.display = 'block';
  document.body.style.overflow = '';
}

function switchEditorView(view) {
  document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const left = document.getElementById('editorLeft');
  const right = document.getElementById('editorRight');
  if (view === 'preview') {
    left.style.display = 'none';
    right.style.flexBasis = '100%';
  } else {
    left.style.display = '';
    right.style.flexBasis = '';
  }
}

// ===== FORM CONTROLS =====
function toggleSection(id) {
  const body = document.getElementById('section-' + id);
  if (!body) return;
  body.classList.toggle('hidden');
  const btn = body.closest('.form-group').querySelector('.toggle-section-btn');
  btn.textContent = body.classList.contains('hidden') ? '+' : '−';
}

// ===== ENTRIES =====
function addEntry(type) {
  const id = ++entryCounters[type];
  const container = document.getElementById(type + '-entries');
  if (!container) return;

  let fields = '';
  if (type === 'experience') {
    fields = `
      <div class="form-row">
        <div class="field-wrap"><label>Job Title</label><input type="text" class="form-input" placeholder="Senior Designer" oninput="updatePreview()" data-field="exp-title-${id}"></div>
        <div class="field-wrap"><label>Company</label><input type="text" class="form-input" placeholder="Google Inc." oninput="updatePreview()" data-field="exp-company-${id}"></div>
      </div>
      <div class="form-row">
        <div class="field-wrap"><label>Start Date</label><input type="text" class="form-input" placeholder="Jan 2022" oninput="updatePreview()" data-field="exp-start-${id}"></div>
        <div class="field-wrap"><label>End Date</label><input type="text" class="form-input" placeholder="Present" oninput="updatePreview()" data-field="exp-end-${id}"></div>
      </div>
      <div class="field-wrap"><label>Description</label><textarea class="form-textarea" rows="3" placeholder="• Led cross-functional team of 8 engineers&#10;• Increased conversion rate by 32%" oninput="updatePreview()" data-field="exp-desc-${id}"></textarea></div>
    `;
  } else if (type === 'education') {
    fields = `
      <div class="form-row">
        <div class="field-wrap"><label>Degree</label><input type="text" class="form-input" placeholder="B.Sc. Computer Science" oninput="updatePreview()" data-field="edu-degree-${id}"></div>
        <div class="field-wrap"><label>Institution</label><input type="text" class="form-input" placeholder="MIT" oninput="updatePreview()" data-field="edu-school-${id}"></div>
      </div>
      <div class="form-row">
        <div class="field-wrap"><label>Year</label><input type="text" class="form-input" placeholder="2018 – 2022" oninput="updatePreview()" data-field="edu-year-${id}"></div>
        <div class="field-wrap"><label>Grade/GPA</label><input type="text" class="form-input" placeholder="3.9 GPA" oninput="updatePreview()" data-field="edu-grade-${id}"></div>
      </div>
    `;
  } else if (type === 'certifications') {
    fields = `
      <div class="form-row">
        <div class="field-wrap"><label>Certification</label><input type="text" class="form-input" placeholder="AWS Solutions Architect" oninput="updatePreview()" data-field="cert-name-${id}"></div>
        <div class="field-wrap"><label>Issuer / Year</label><input type="text" class="form-input" placeholder="Amazon, 2023" oninput="updatePreview()" data-field="cert-issuer-${id}"></div>
      </div>
    `;
  } else if (type === 'references') {
    fields = `
      <div class="form-row">
        <div class="field-wrap"><label>Name</label><input type="text" class="form-input" placeholder="Dr. John Smith" oninput="updatePreview()" data-field="ref-name-${id}"></div>
        <div class="field-wrap"><label>Role</label><input type="text" class="form-input" placeholder="Director, Google" oninput="updatePreview()" data-field="ref-role-${id}"></div>
      </div>
      <div class="field-wrap"><label>Email / Phone</label><input type="text" class="form-input" placeholder="john@google.com" oninput="updatePreview()" data-field="ref-contact-${id}"></div>
    `;
  }

  const item = document.createElement('div');
  item.className = 'entry-item';
  item.id = `entry-${type}-${id}`;
  item.innerHTML = `<button class="remove-btn" onclick="removeEntry('${type}',${id})">✕</button>${fields}`;
  container.appendChild(item);
}

function removeEntry(type, id) {
  const el = document.getElementById(`entry-${type}-${id}`);
  if (el) el.remove();
  updatePreview();
}

function addDefaultEntries() {
  addEntry('experience');
  addEntry('education');
}

// ===== CUSTOM SECTIONS =====
function addCustomSection() {
  const name = prompt('Section name (e.g. Projects, Volunteer Work):');
  if (!name) return;
  const id = 'custom-' + Date.now();
  const section = document.createElement('div');
  section.className = 'form-group';
  section.dataset.section = id;
  section.innerHTML = `
    <div class="form-group-header">
      <span>✦ ${name}</span>
      <div class="header-actions">
        <button class="toggle-section-btn" onclick="toggleSection('${id}')">−</button>
      </div>
    </div>
    <div class="form-group-body" id="section-${id}">
      <textarea class="form-textarea" rows="4" placeholder="Add your content here..." oninput="updatePreview()" data-field="custom-${id}"></textarea>
    </div>
  `;
  document.getElementById('formSections').appendChild(section);
}

// ===== CUSTOMIZATION =====
function renderColorPalettes() {
  const container = document.getElementById('colorPalettes');
  if (!container) return;
  container.innerHTML = colorPalettes.map((p, i) =>
    `<div class="color-dot ${i===0?'active':''}" style="background:${p.primary}" 
         onclick="applyColor(${i}, this)" title="${p.name}"></div>`
  ).join('');
}

function applyColor(index, el) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  if (el) el.classList.add('active');
  currentColor = colorPalettes[index].primary;
  currentAccent = colorPalettes[index].accent;
  updatePreview();
}

function highlightActiveColor() {
  const dots = document.querySelectorAll('.color-dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', colorPalettes[i].primary === currentColor);
  });
}

function applyFont(val) {
  currentFont = val;
  updatePreview();
}

function applyFontSize(val) {
  currentFontSize = parseInt(val);
  updatePreview();
}

function applyTheme(val) {
  currentTheme = val;
  updatePreview();
}

function applyLayout(val) {
  currentLayout = val;
  const picker = document.getElementById('layoutPicker');
  if (picker) picker.value = val;
  updatePreview();
}

// ===== ZOOM =====
function applyZoom(z) {
  currentZoom = Math.max(0.4, Math.min(1.5, z));
  const scaler = document.getElementById('previewScaler');
  const doc = document.getElementById('cvDocument');
  if (doc) doc.style.transform = `scale(${currentZoom})`;
  const lvl = document.getElementById('zoomLevel');
  if (lvl) lvl.textContent = Math.round(currentZoom * 100) + '%';
}

function adjustZoom(delta) {
  applyZoom(currentZoom + delta);
}

// ===== COLLECT DATA =====
function collectData() {
  const get = id => (document.getElementById(id) || {}).value || '';

  // Collect experience entries
  const experiences = [];
  document.querySelectorAll('[id^="entry-experience-"]').forEach(el => {
    const id = el.id.split('-').pop();
    const title = (el.querySelector(`[data-field="exp-title-${id}"]`) || {}).value || '';
    if (!title) return;
    experiences.push({
      title,
      company: (el.querySelector(`[data-field="exp-company-${id}"]`) || {}).value || '',
      start:   (el.querySelector(`[data-field="exp-start-${id}"]`)   || {}).value || '',
      end:     (el.querySelector(`[data-field="exp-end-${id}"]`)     || {}).value || '',
      desc:    (el.querySelector(`[data-field="exp-desc-${id}"]`)    || {}).value || '',
    });
  });

  // Education
  const educations = [];
  document.querySelectorAll('[id^="entry-education-"]').forEach(el => {
    const id = el.id.split('-').pop();
    const degree = (el.querySelector(`[data-field="edu-degree-${id}"]`) || {}).value || '';
    if (!degree) return;
    educations.push({
      degree,
      school: (el.querySelector(`[data-field="edu-school-${id}"]`) || {}).value || '',
      year:   (el.querySelector(`[data-field="edu-year-${id}"]`)   || {}).value || '',
      grade:  (el.querySelector(`[data-field="edu-grade-${id}"]`)  || {}).value || '',
    });
  });

  // Certifications
  const certifications = [];
  document.querySelectorAll('[id^="entry-certifications-"]').forEach(el => {
    const id = el.id.split('-').pop();
    const name = (el.querySelector(`[data-field="cert-name-${id}"]`) || {}).value || '';
    if (!name) return;
    certifications.push({
      name,
      issuer: (el.querySelector(`[data-field="cert-issuer-${id}"]`) || {}).value || '',
    });
  });

  // References
  const references = [];
  document.querySelectorAll('[id^="entry-references-"]').forEach(el => {
    const id = el.id.split('-').pop();
    const name = (el.querySelector(`[data-field="ref-name-${id}"]`) || {}).value || '';
    if (!name) return;
    references.push({
      name,
      role:    (el.querySelector(`[data-field="ref-role-${id}"]`)    || {}).value || '',
      contact: (el.querySelector(`[data-field="ref-contact-${id}"]`) || {}).value || '',
    });
  });

  // Custom sections
  const customSections = [];
  document.querySelectorAll('[data-field^="custom-"]').forEach(el => {
    const sectionId = el.dataset.field.replace('custom-', '');
    const header = el.closest('.form-group').querySelector('.form-group-header span');
    if (el.value && header) {
      customSections.push({ label: header.textContent.replace('✦ ',''), content: el.value });
    }
  });

  return {
    name:         get('f-name'),
    title:        get('f-title'),
    email:        get('f-email'),
    phone:        get('f-phone'),
    address:      get('f-address'),
    linkedin:     get('f-linkedin'),
    photo:        photoBase64 || get('f-photo'),
    objective:    get('f-objective'),
    skills:       get('f-skills'),
    languages:    get('f-languages'),
    achievements: get('f-achievements'),
    interests:    get('f-interests'),
    experiences,
    educations,
    certifications,
    references,
    customSections,
  };
}

// ===== BUILD CV HTML =====
function buildCVHTML(data) {
  const tpl = templates.find(t => t.id === currentTemplate) || templates[0];
  const colors = { primary: currentColor, sidebar: darken(currentColor, 15), accent: lighten(currentColor, 70) };

  const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const langs  = data.languages ? data.languages.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Theme styles
  let themeStyle = '';
  if (currentTheme === 'dark') {
    themeStyle = 'background:#1a1a2e;color:#e8e8f0;';
  } else if (currentTheme === 'glass') {
    themeStyle = 'background:linear-gradient(135deg,#f8f9ff 0%,#eef0ff 100%);color:#1a1a2e;';
  }

  const photoHtml = data.photo
    ? `<img src="${data.photo}" class="cv-photo" alt="Profile" onerror="this.style.display='none'">`
    : `<div class="cv-photo-placeholder" style="background:${colors.primary}">${(data.name || 'A').charAt(0).toUpperCase()}</div>`;

  if (currentLayout === 'sidebar') {
    return buildSidebarLayout(data, colors, skills, langs, photoHtml, themeStyle);
  } else if (currentLayout === 'modern') {
    return buildModernLayout(data, colors, skills, langs, photoHtml, themeStyle);
  } else {
    return buildClassicLayout(data, colors, skills, langs, photoHtml, themeStyle);
  }
}

// ===== SIDEBAR LAYOUT =====
function buildSidebarLayout(data, colors, skills, langs, photoHtml, themeStyle) {
  const sidebarBg = colors.primary;
  const sidebarColor = '#ffffff';
  const mainBg = currentTheme === 'dark' ? '#1a1a2e' : '#ffffff';
  const mainColor = currentTheme === 'dark' ? '#e8e8f0' : '#1a1a1a';

  return `
<div class="cv-sidebar-layout" style="font-family:${currentFont};font-size:${currentFontSize}px;${themeStyle}">
  <!-- SIDEBAR -->
  <div class="cv-sidebar" style="background:${sidebarBg};color:${sidebarColor}">
    <div style="text-align:center;margin-bottom:8px">
      ${photoHtml.replace('class="cv-photo"','class="cv-photo" style="width:80px;height:80px;border:3px solid rgba(255,255,255,0.4)"')}
      <div style="margin-top:10px;font-size:14px;font-weight:800;line-height:1.2">${data.name || 'Your Name'}</div>
      <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.8;margin-top:4px">${data.title || 'Professional Title'}</div>
    </div>

    ${data.email||data.phone||data.address ? `
    <div>
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:5px;margin-bottom:8px">Contact</div>
      ${data.email    ? `<div style="font-size:9px;margin-bottom:4px;opacity:0.9">✉ ${data.email}</div>` : ''}
      ${data.phone    ? `<div style="font-size:9px;margin-bottom:4px;opacity:0.9">📞 ${data.phone}</div>` : ''}
      ${data.address  ? `<div style="font-size:9px;margin-bottom:4px;opacity:0.9">📍 ${data.address}</div>` : ''}
      ${data.linkedin ? `<div style="font-size:9px;margin-bottom:4px;opacity:0.9">🔗 ${data.linkedin}</div>` : ''}
    </div>` : ''}

    ${skills.length ? `
    <div>
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:5px;margin-bottom:8px">Skills</div>
      ${skills.map(s => `<div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px 8px;margin-bottom:4px;font-size:9px">${s}</div>`).join('')}
    </div>` : ''}

    ${langs.length ? `
    <div>
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:5px;margin-bottom:8px">Languages</div>
      ${langs.map(l => `<div style="font-size:9px;margin-bottom:4px;opacity:0.9">${l}</div>`).join('')}
    </div>` : ''}

    ${data.interests ? `
    <div>
      <div style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:5px;margin-bottom:8px">Interests</div>
      <div style="font-size:9px;opacity:0.85;line-height:1.6">${data.interests}</div>
    </div>` : ''}
  </div>

  <!-- MAIN CONTENT -->
  <div class="cv-main" style="background:${mainBg};color:${mainColor}">

    ${data.objective ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Profile</div>
      <div style="font-size:9.5px;line-height:1.6;opacity:0.85;font-style:italic">${data.objective}</div>
    </div>` : ''}

    ${data.experiences.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Experience</div>
      ${data.experiences.map(e => `
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div style="font-size:10.5px;font-weight:700">${e.title}</div>
            <div style="font-size:9px;opacity:0.6;white-space:nowrap;margin-left:8px">${e.start}${e.end ? ' – ' + e.end : ''}</div>
          </div>
          <div style="font-size:9.5px;color:${colors.primary};margin-bottom:4px;font-weight:600">${e.company}</div>
          ${e.desc ? `<div style="font-size:9.5px;line-height:1.55;opacity:0.8;white-space:pre-line">${e.desc}</div>` : ''}
        </div>`).join('')}
    </div>` : ''}

    ${data.educations.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Education</div>
      ${data.educations.map(e => `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between">
            <div style="font-size:10.5px;font-weight:700">${e.degree}</div>
            <div style="font-size:9px;opacity:0.6">${e.year}</div>
          </div>
          <div style="font-size:9.5px;opacity:0.75;font-style:italic">${e.school}${e.grade ? ' · ' + e.grade : ''}</div>
        </div>`).join('')}
    </div>` : ''}

    ${data.certifications.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Certifications</div>
      ${data.certifications.map(c => `
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <div style="font-size:10px;font-weight:600">${c.name}</div>
          <div style="font-size:9px;opacity:0.6">${c.issuer}</div>
        </div>`).join('')}
    </div>` : ''}

    ${data.achievements ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Achievements</div>
      <div style="font-size:9.5px;line-height:1.6;opacity:0.85;white-space:pre-line">${data.achievements}</div>
    </div>` : ''}

    ${data.references.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">References</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${data.references.map(r => `
        <div>
          <div style="font-size:10px;font-weight:700">${r.name}</div>
          <div style="font-size:9px;opacity:0.7;font-style:italic">${r.role}</div>
          <div style="font-size:9px;opacity:0.6">${r.contact}</div>
        </div>`).join('')}
      </div>
    </div>` : ''}

    ${data.customSections.map(cs => `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:2px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">${cs.label}</div>
      <div style="font-size:9.5px;line-height:1.6;opacity:0.85;white-space:pre-line">${cs.content}</div>
    </div>`).join('')}

  </div>
</div>`;
}

// ===== CLASSIC LAYOUT =====
function buildClassicLayout(data, colors, skills, langs, photoHtml, themeStyle) {
  const bg = currentTheme === 'dark' ? '#1a1a2e' : '#ffffff';
  const color = currentTheme === 'dark' ? '#e8e8f0' : '#1a1a1a';

  return `
<div class="cv-classic-layout" style="font-family:${currentFont};font-size:${currentFontSize}px;background:${bg};color:${color};${themeStyle}">

  <!-- HEADER -->
  <div class="cv-classic-header" style="border-bottom-color:${colors.primary}">
    ${photoHtml}
    <div style="flex:1">
      <div style="font-size:24px;font-weight:900;letter-spacing:-1px;line-height:1.1">${data.name || 'Your Full Name'}</div>
      <div style="font-size:11px;color:${colors.primary};font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:4px 0">${data.title || 'Professional Title'}</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:9px;opacity:0.7;margin-top:6px">
        ${data.email ? `<span>✉ ${data.email}</span>` : ''}
        ${data.phone ? `<span>📞 ${data.phone}</span>` : ''}
        ${data.address ? `<span>📍 ${data.address}</span>` : ''}
        ${data.linkedin ? `<span>🔗 ${data.linkedin}</span>` : ''}
      </div>
    </div>
  </div>

  ${data.objective ? `
  <div>
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:8px">Career Objective</div>
    <div style="font-size:9.5px;line-height:1.65;opacity:0.85;font-style:italic;background:${colors.accent};padding:10px 14px;border-radius:4px;border-left:3px solid ${colors.primary}">${data.objective}</div>
  </div>` : ''}

  ${data.experiences.length ? `
  <div>
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Professional Experience</div>
    ${data.experiences.map(e => `
      <div style="margin-bottom:14px;padding-left:12px;border-left:2px solid ${colors.accent}">
        <div style="display:flex;justify-content:space-between">
          <div style="font-size:11px;font-weight:700">${e.title}</div>
          <div style="font-size:9px;opacity:0.55">${e.start}${e.end ? ' – '+e.end : ''}</div>
        </div>
        <div style="font-size:9.5px;color:${colors.primary};font-weight:600;margin-bottom:3px">${e.company}</div>
        ${e.desc ? `<div style="font-size:9.5px;line-height:1.55;opacity:0.78;white-space:pre-line">${e.desc}</div>` : ''}
      </div>`).join('')}
  </div>` : ''}

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    ${data.educations.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Education</div>
      ${data.educations.map(e => `
        <div style="margin-bottom:10px">
          <div style="font-size:10.5px;font-weight:700">${e.degree}</div>
          <div style="font-size:9.5px;opacity:0.7;font-style:italic">${e.school}</div>
          <div style="font-size:9px;opacity:0.6">${e.year}${e.grade ? ' · ' + e.grade : ''}</div>
        </div>`).join('')}
    </div>` : ''}

    ${skills.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Skills</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${skills.map(s => `<span style="background:${colors.accent};color:${colors.primary};padding:3px 9px;border-radius:3px;font-size:9px;font-weight:600">${s}</span>`).join('')}
      </div>
    </div>` : ''}
  </div>

  ${data.certifications.length ? `
  <div>
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Certifications</div>
    ${data.certifications.map(c => `
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:10px;font-weight:600">${c.name}</span>
        <span style="font-size:9px;opacity:0.6">${c.issuer}</span>
      </div>`).join('')}
  </div>` : ''}

  ${data.achievements ? `
  <div>
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Achievements</div>
    <div style="font-size:9.5px;line-height:1.6;opacity:0.85;white-space:pre-line">${data.achievements}</div>
  </div>` : ''}

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    ${langs.length ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Languages</div>
      ${langs.map(l => `<div style="font-size:9.5px;margin-bottom:4px">${l}</div>`).join('')}
    </div>` : ''}

    ${data.interests ? `
    <div>
      <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">Interests</div>
      <div style="font-size:9.5px;line-height:1.6;opacity:0.85">${data.interests}</div>
    </div>` : ''}
  </div>

  ${data.references.length ? `
  <div>
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">References</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px">
    ${data.references.map(r => `
      <div style="background:${colors.accent};padding:10px 12px;border-radius:4px">
        <div style="font-size:10px;font-weight:700">${r.name}</div>
        <div style="font-size:9px;color:${colors.primary};font-weight:600">${r.role}</div>
        <div style="font-size:9px;opacity:0.65">${r.contact}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  ${data.customSections.map(cs => `
  <div>
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};border-bottom:1px solid ${colors.primary};padding-bottom:5px;margin-bottom:10px">${cs.label}</div>
    <div style="font-size:9.5px;line-height:1.6;opacity:0.85;white-space:pre-line">${cs.content}</div>
  </div>`).join('')}

</div>`;
}

// ===== MODERN LAYOUT =====
function buildModernLayout(data, colors, skills, langs, photoHtml, themeStyle) {
  const bg = currentTheme === 'dark' ? '#0f0f1a' : '#f8fafc';
  const cardBg = currentTheme === 'dark' ? '#1a1a2e' : '#ffffff';
  const textColor = currentTheme === 'dark' ? '#e8e8f0' : '#1a1a1a';

  return `
<div class="cv-modern-layout" style="font-family:${currentFont};font-size:${currentFontSize}px;background:${bg};${themeStyle}">
  <!-- HEADER BAND -->
  <div style="background:${colors.primary};padding:36px 48px;display:flex;align-items:center;gap:24px;color:white">
    ${photoHtml}
    <div style="flex:1">
      <div style="font-size:26px;font-weight:900;letter-spacing:-1px">${data.name || 'Your Name'}</div>
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;opacity:0.85;margin:4px 0">${data.title || 'Professional Title'}</div>
      <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:9px;opacity:0.75;margin-top:8px">
        ${data.email ? `<span>✉ ${data.email}</span>` : ''}
        ${data.phone ? `<span>📞 ${data.phone}</span>` : ''}
        ${data.address ? `<span>📍 ${data.address}</span>` : ''}
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div style="padding:32px 48px;display:grid;grid-template-columns:1fr 200px;gap:36px;color:${textColor}">

    <!-- LEFT COLUMN -->
    <div style="display:flex;flex-direction:column;gap:20px">

      ${data.objective ? `
      <div style="background:${cardBg};padding:16px 20px;border-radius:6px;border-left:4px solid ${colors.primary}">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:8px">Profile</div>
        <div style="font-size:9.5px;line-height:1.65;opacity:0.85">${data.objective}</div>
      </div>` : ''}

      ${data.experiences.length ? `
      <div style="background:${cardBg};padding:16px 20px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:12px">Experience</div>
        ${data.experiences.map(e => `
          <div style="margin-bottom:14px;position:relative;padding-left:14px;border-left:2px solid ${colors.primary}">
            <div style="position:absolute;left:-5px;top:3px;width:8px;height:8px;border-radius:50%;background:${colors.primary}"></div>
            <div style="display:flex;justify-content:space-between">
              <div style="font-size:11px;font-weight:700">${e.title}</div>
              <div style="font-size:9px;opacity:0.55">${e.start}${e.end ? '–'+e.end : ''}</div>
            </div>
            <div style="font-size:9.5px;color:${colors.primary};font-weight:600;margin-bottom:3px">${e.company}</div>
            ${e.desc ? `<div style="font-size:9.5px;line-height:1.55;opacity:0.78;white-space:pre-line">${e.desc}</div>` : ''}
          </div>`).join('')}
      </div>` : ''}

      ${data.educations.length ? `
      <div style="background:${cardBg};padding:16px 20px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:12px">Education</div>
        ${data.educations.map(e => `
          <div style="margin-bottom:10px;display:flex;justify-content:space-between">
            <div>
              <div style="font-size:10.5px;font-weight:700">${e.degree}</div>
              <div style="font-size:9.5px;opacity:0.7;font-style:italic">${e.school}${e.grade ? ' · '+e.grade : ''}</div>
            </div>
            <div style="font-size:9px;opacity:0.55;white-space:nowrap;margin-left:8px">${e.year}</div>
          </div>`).join('')}
      </div>` : ''}

      ${data.achievements ? `
      <div style="background:${cardBg};padding:16px 20px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:8px">Achievements</div>
        <div style="font-size:9.5px;line-height:1.6;opacity:0.85;white-space:pre-line">${data.achievements}</div>
      </div>` : ''}

      ${data.customSections.map(cs => `
      <div style="background:${cardBg};padding:16px 20px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:8px">${cs.label}</div>
        <div style="font-size:9.5px;line-height:1.6;opacity:0.85;white-space:pre-line">${cs.content}</div>
      </div>`).join('')}

    </div>

    <!-- RIGHT COLUMN -->
    <div style="display:flex;flex-direction:column;gap:16px">

      ${skills.length ? `
      <div style="background:${cardBg};padding:14px 16px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:10px">Skills</div>
        ${skills.map(s => `
          <div style="margin-bottom:6px">
            <div style="font-size:9px;margin-bottom:2px">${s}</div>
            <div style="height:4px;background:${colors.accent};border-radius:2px">
              <div style="height:100%;background:${colors.primary};border-radius:2px;width:${70+Math.random()*25}%"></div>
            </div>
          </div>`).join('')}
      </div>` : ''}

      ${langs.length ? `
      <div style="background:${cardBg};padding:14px 16px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:10px">Languages</div>
        ${langs.map(l => `<div style="font-size:9.5px;margin-bottom:5px;padding:4px 0;border-bottom:1px solid ${colors.accent}">${l}</div>`).join('')}
      </div>` : ''}

      ${data.certifications.length ? `
      <div style="background:${cardBg};padding:14px 16px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:10px">Certifications</div>
        ${data.certifications.map(c => `
          <div style="margin-bottom:8px">
            <div style="font-size:9.5px;font-weight:700">${c.name}</div>
            <div style="font-size:9px;opacity:0.6">${c.issuer}</div>
          </div>`).join('')}
      </div>` : ''}

      ${data.references.length ? `
      <div style="background:${cardBg};padding:14px 16px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:10px">References</div>
        ${data.references.map(r => `
          <div style="margin-bottom:10px">
            <div style="font-size:9.5px;font-weight:700">${r.name}</div>
            <div style="font-size:9px;color:${colors.primary}">${r.role}</div>
            <div style="font-size:9px;opacity:0.6">${r.contact}</div>
          </div>`).join('')}
      </div>` : ''}

      ${data.interests ? `
      <div style="background:${cardBg};padding:14px 16px;border-radius:6px">
        <div style="font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${colors.primary};margin-bottom:8px">Interests</div>
        <div style="font-size:9.5px;line-height:1.6;opacity:0.85">${data.interests}</div>
      </div>` : ''}

    </div>
  </div>
</div>`;
}

// ===== UPDATE PREVIEW =====
function updatePreview() {
  const data = collectData();
  const html = buildCVHTML(data);
  const doc = document.getElementById('cvDocument');
  if (doc) doc.innerHTML = html;
  scheduleAutoSave();
}

// ===== AUTO SAVE =====
function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => autoSave(true), 2000);
}

function autoSave(silent = false) {
  const data = collectData();
  try {
    localStorage.setItem('cvcraft_data', JSON.stringify(data));
    localStorage.setItem('cvcraft_template', currentTemplate);
    localStorage.setItem('cvcraft_color', currentColor);
    localStorage.setItem('cvcraft_layout', currentLayout);
    if (!silent) showToast('💾 Saved successfully!');
  } catch(e) {
    if (!silent) showToast('⚠ Could not save to storage');
  }
}

function loadSavedData() {
  try {
    const saved = localStorage.getItem('cvcraft_data');
    if (saved) {
      const d = JSON.parse(saved);
      const setVal = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
      setVal('f-name', d.name);
      setVal('f-title', d.title);
      setVal('f-email', d.email);
      setVal('f-phone', d.phone);
      setVal('f-address', d.address);
      setVal('f-linkedin', d.linkedin);
      setVal('f-objective', d.objective);
      setVal('f-skills', d.skills);
      setVal('f-languages', d.languages);
      setVal('f-achievements', d.achievements);
      setVal('f-interests', d.interests);
    }
  } catch(e) {}
}

// ===== PHOTO UPLOAD =====
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    photoBase64 = ev.target.result;
    const urlInput = document.getElementById('f-photo');
    if (urlInput) urlInput.value = '';
    updatePreview();
    showToast('✓ Photo uploaded');
  };
  reader.readAsDataURL(file);
}

// ===== DOWNLOAD =====
function toggleDownloadMenu() {
  document.getElementById('downloadMenu').classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.download-dropdown')) {
    document.getElementById('downloadMenu').classList.remove('open');
  }
});

function downloadCV(format) {
  document.getElementById('downloadMenu').classList.remove('open');
  if (format === 'pdf') downloadPDF();
  else if (format === 'docx') downloadDOCX();
}

function getCVEmbedCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 0; }
    html, body { width: 210mm; min-height: 297mm; background: white; }

    /* ── Sidebar layout ── */
    .cv-sidebar-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 297mm;
      width: 210mm;
    }
    .cv-sidebar {
      padding: 40px 28px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      word-break: break-word;
    }
    .cv-main {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      word-break: break-word;
    }

    /* ── Classic layout ── */
    .cv-classic-layout {
      padding: 48px 56px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-height: 297mm;
      width: 210mm;
      word-break: break-word;
    }
    .cv-classic-header {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      padding-bottom: 20px;
      margin-bottom: 4px;
    }

    /* ── Modern layout ── */
    .cv-modern-layout {
      display: flex;
      flex-direction: column;
      min-height: 297mm;
      width: 210mm;
      word-break: break-word;
    }

    /* ── Photo ── */
    .cv-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      flex-shrink: 0;
    }
    .cv-photo-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    /* ── Print tweaks ── */
    @media print {
      html, body { width: 210mm; height: 297mm; overflow: hidden; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    }
  `;
}

function downloadPDF() {
  showToast('⏳ Generating PDF...');
  const data = collectData();
  const html = buildCVHTML(data);
  const name = data.name || 'CV';

  const printContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${name} - CV</title>
<style>${getCVEmbedCSS()}</style>
</head>
<body>${html}</body>
</html>`;

  const blob = new Blob([printContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => {
        win.print();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }, 1200);
    };
    showToast('✓ Print dialog opened — Save as PDF');
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g,'_')}_CV.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    showToast('✓ CV saved as HTML — Open in browser and print to PDF');
  }
}

function downloadDOCX() {
  showToast('⏳ Generating styled document...');
  const data = collectData();
  const html = buildCVHTML(data);
  const name = data.name || 'CV';

  const wordContent = '<!DOCTYPE html>\n' +
    '<html xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
    '      xmlns:w="urn:schemas-microsoft-com:office:word"\n' +
    '      xmlns="http://www.w3.org/TR/REC-html40">\n' +
    '<head><meta charset="UTF-8">\n' +
    '<meta name="ProgId" content="Word.Document">\n' +
    '<title>' + name + ' - CV</title>\n' +
    '<style>\n@page { size: 21cm 29.7cm; margin: 0; }\n' +
    getCVEmbedCSS() +
    '\nbody { margin: 0; padding: 0; }\n</style>\n' +
    '</head><body>' + html + '</body></html>';

  const blob = new Blob(['\xef\xbb\xbf', wordContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name.replace(/\s+/g, '_') + '_CV.doc';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('✓ Downloaded! Open with Microsoft Word or Google Docs');
}

function buildRTF(data) {
  const esc = s => (s || '').replace(/\\/g,'\\\\').replace(/\{/g,'\\{').replace(/\}/g,'\\}');
  const lines = [];

  lines.push('{\\rtf1\\ansi\\deff0');
  lines.push('{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fswiss\\fcharset0 Arial;}}');
  lines.push('{\\colortbl;\\red37\\green99\\blue235;}');
  lines.push('\\paperw11906\\paperh16838\\margl1440\\margr1440\\margt1440\\margb1440');

  // Name
  lines.push(`\\f1\\b\\fs32\\cf1 ${esc(data.name || 'Your Name')}\\cf0\\b0\\par`);
  lines.push(`\\f1\\b\\fs22 ${esc(data.title || '')}\\b0\\par`);

  // Contact
  const contacts = [data.email, data.phone, data.address, data.linkedin].filter(Boolean);
  if (contacts.length) lines.push(`\\f1\\fs18 ${contacts.map(esc).join('  |  ')}\\par`);
  lines.push('\\par');

  // Objective
  if (data.objective) {
    lines.push('\\f1\\b\\fs22 CAREER OBJECTIVE\\b0\\par');
    lines.push(`\\f1\\fs18 ${esc(data.objective)}\\par\\par`);
  }

  // Experience
  if (data.experiences.length) {
    lines.push('\\f1\\b\\fs22 PROFESSIONAL EXPERIENCE\\b0\\par');
    data.experiences.forEach(e => {
      lines.push(`\\f1\\b\\fs20 ${esc(e.title)}\\b0  \\i ${esc(e.company)}\\i0   ${esc(e.start)} ${e.end?'- '+e.end:''}\\par`);
      if (e.desc) lines.push(`\\f1\\fs18 ${esc(e.desc)}\\par`);
      lines.push('\\par');
    });
  }

  // Education
  if (data.educations.length) {
    lines.push('\\f1\\b\\fs22 EDUCATION\\b0\\par');
    data.educations.forEach(e => {
      lines.push(`\\f1\\b\\fs20 ${esc(e.degree)}\\b0  \\i ${esc(e.school)}\\i0   ${esc(e.year)}${e.grade?' | '+e.grade:''}\\par`);
    });
    lines.push('\\par');
  }

  // Skills
  if (data.skills) {
    lines.push('\\f1\\b\\fs22 SKILLS\\b0\\par');
    lines.push(`\\f1\\fs18 ${esc(data.skills)}\\par\\par`);
  }

  // Certifications
  if (data.certifications.length) {
    lines.push('\\f1\\b\\fs22 CERTIFICATIONS\\b0\\par');
    data.certifications.forEach(c => lines.push(`\\f1\\fs18 ${esc(c.name)}  |  ${esc(c.issuer)}\\par`));
    lines.push('\\par');
  }

  // Languages
  if (data.languages) {
    lines.push('\\f1\\b\\fs22 LANGUAGES\\b0\\par');
    lines.push(`\\f1\\fs18 ${esc(data.languages)}\\par\\par`);
  }

  // Achievements
  if (data.achievements) {
    lines.push('\\f1\\b\\fs22 ACHIEVEMENTS\\b0\\par');
    lines.push(`\\f1\\fs18 ${esc(data.achievements)}\\par\\par`);
  }

  // References
  if (data.references.length) {
    lines.push('\\f1\\b\\fs22 REFERENCES\\b0\\par');
    data.references.forEach(r => {
      lines.push(`\\f1\\b\\fs18 ${esc(r.name)}\\b0  -  ${esc(r.role)}  |  ${esc(r.contact)}\\par`);
    });
  }

  // Custom
  data.customSections.forEach(cs => {
    lines.push(`\\f1\\b\\fs22 ${esc(cs.label.toUpperCase())}\\b0\\par`);
    lines.push(`\\f1\\fs18 ${esc(cs.content)}\\par\\par`);
  });

  lines.push('}');
  return lines.join('\n');
}

function printCV() {
  document.getElementById('downloadMenu').classList.remove('open');
  updatePreview();
  setTimeout(() => window.print(), 300);
}

// ===== AI MODAL =====
function triggerAI() {
  document.getElementById('aiModal').classList.add('open');
}

function closeAIModal() {
  document.getElementById('aiModal').classList.remove('open');
}

function selectAIOption(btn, option) {
  document.querySelectorAll('.ai-option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  aiOption = option;
}

function generateAIObjective() {
  triggerAI();
  selectAIOption(document.querySelectorAll('.ai-option-btn')[0], 'objective');
}

function generateAISkills() {
  triggerAI();
  selectAIOption(document.querySelectorAll('.ai-option-btn')[1], 'skills');
}

let aiSelectedContent = '';

async function runAI() {
  const context = document.getElementById('aiContext').value;
  const outputDiv = document.getElementById('aiOutput');
  const outputText = document.getElementById('aiOutputText');
  const btn = document.getElementById('aiRunBtn');

  btn.disabled = true;
  btn.textContent = 'Generating...';
  outputDiv.style.display = 'block';
  outputText.innerHTML = '<div class="ai-loading"><span></span><span></span><span></span></div>';

  const prompts = {
    objective: `You are a professional CV writer. Write a compelling 3-sentence career objective for someone who describes themselves as: "${context || 'an experienced professional seeking growth opportunities'}". Make it specific, achievement-focused, and ATS-friendly. Return only the objective text, no labels.`,
    skills: `List 12-15 professional skills for someone described as: "${context || 'a business professional'}". Format as a comma-separated list only. Include both technical and soft skills.`,
    experience: `Write 4 impactful bullet points for a work experience entry. Context: "${context || 'managed projects and led a team'}". Each bullet should start with an action verb and include measurable results. Return only the bullets, one per line starting with •`,
    summary: `Write a powerful 4-sentence professional summary for: "${context || 'an experienced professional'}". Focus on value proposition, key strengths, and career impact. Return only the summary text.`,
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompts[aiOption] || prompts.objective }]
      })
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || 'No response generated.';
    aiSelectedContent = text;
    outputText.textContent = text;

  } catch (err) {
    // Fallback AI responses for demo
    const fallbacks = {
      objective: `Results-driven professional with a proven track record of delivering impactful solutions in fast-paced environments. Adept at leading cross-functional teams, driving strategic initiatives, and consistently exceeding performance targets. Seeking to leverage expertise in ${context || 'my field'} to contribute meaningfully to an innovative organization committed to excellence.`,
      skills: `Leadership, Strategic Planning, Project Management, Data Analysis, Team Collaboration, Problem Solving, Communication, Microsoft Office, Customer Relationship Management, Agile Methodology, Budget Management, Process Optimization, Stakeholder Engagement, Critical Thinking`,
      experience: `• Led a team of 8 professionals to deliver a $2M project 3 weeks ahead of schedule\n• Increased department efficiency by 35% through implementation of streamlined workflows\n• Managed relationships with 20+ key stakeholders, resulting in 95% client satisfaction score\n• Developed and executed strategy that contributed $500K in additional annual revenue`,
      summary: `Dynamic and results-oriented professional with 5+ years of demonstrated expertise in driving organizational success. Known for building high-performing teams and delivering innovative solutions that consistently exceed expectations. Combines analytical acumen with exceptional interpersonal skills to bridge technical and business objectives. Committed to continuous growth and making a measurable impact in every role undertaken.`,
    };
    aiSelectedContent = fallbacks[aiOption] || fallbacks.objective;
    outputText.textContent = aiSelectedContent;
  }

  btn.disabled = false;
  btn.textContent = 'Generate with AI →';
}

function applyAIOutput() {
  if (!aiSelectedContent) return;
  const fieldMap = {
    objective: 'f-objective',
    skills: 'f-skills',
    summary: 'f-objective',
    experience: null,
  };
  const fieldId = fieldMap[aiOption];
  if (fieldId) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = aiSelectedContent;
      updatePreview();
      showToast('✓ AI content applied to CV!');
      closeAIModal();
    }
  } else {
    // For experience, copy to clipboard
    navigator.clipboard.writeText(aiSelectedContent).then(() => {
      showToast('✓ Copied! Paste into your experience description');
      closeAIModal();
    }).catch(() => {
      showToast('Copy the text above and paste into description');
    });
  }
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== UTILITY =====
function darken(hex, pct) {
  const c = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (c >> 16) - pct * 2);
  const g = Math.max(0, ((c >> 8) & 0xff) - pct * 2);
  const b = Math.max(0, (c & 0xff) - pct * 2);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function lighten(hex, pct) {
  const c = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (c >> 16) + pct * 2);
  const g = Math.min(255, ((c >> 8) & 0xff) + pct * 2);
  const b = Math.min(255, (c & 0xff) + pct * 2);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('aiModal').classList.contains('open')) closeAIModal();
    else if (document.getElementById('editorModal').classList.contains('open')) closeEditor();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    autoSave();
  }
});
