/**
 * SKILY — AI Student Success & Career Guidance Platform
 * Interactive UI, Generative Prototype Wizard & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavbarScroll();
  initMobileMenu();
  initHeroParallax();
  initScrollReveals();
  initRoadmapTimeline();
  initRoadmapArchetypeSwitcher();
  initFeaturesMiniMocks();
  initRoadmapGeneratorWizard();
  initCareerModals();
  initFaqAccordion();
  initCtaForm();
  initBackToTop();
});

/* ==========================================================================
   0. Theme Switcher (Dark / Light — fully toggleable with persistence)
   ========================================================================== */
function initThemeSwitcher() {
  const toggleBtn    = document.getElementById('theme-toggle');
  const mobileBtn    = document.getElementById('mobile-theme-toggle');
  const floatingBtn  = document.getElementById('floating-theme-toggle');
  const floatingPill = document.getElementById('floating-theme-pill');

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('skily_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme, notify = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('skily_theme', theme); } catch (e) {}
    const isDark = theme === 'dark';
    const label  = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    if (toggleBtn)   { toggleBtn.setAttribute('aria-label', label); toggleBtn.setAttribute('title', label); }
    if (mobileBtn)   mobileBtn.setAttribute('aria-label', label);
    if (floatingBtn) floatingBtn.setAttribute('aria-label', label);
    if (notify) showToast(isDark ? '🌙 Dark theme on' : '☀️ Light theme on');
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
  };

  // Apply saved / system preference on load
  applyTheme(getPreferredTheme(), false);

  if (toggleBtn)   toggleBtn.addEventListener('click', toggleTheme);
  if (mobileBtn)   mobileBtn.addEventListener('click', toggleTheme);
  if (floatingBtn) floatingBtn.addEventListener('click', toggleTheme);

  // Respect system-level preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('skily_theme')) applyTheme(e.matches ? 'dark' : 'light', false);
  });

  // Floating pill auto-hide: shows on scroll / mouse / touch, hides after 3s idle
  if (floatingPill) {
    let hideTimer;
    const showPill = () => {
      floatingPill.classList.remove('hidden');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => floatingPill.classList.add('hidden'), 3000);
    };
    window.addEventListener('scroll',     showPill, { passive: true });
    document.addEventListener('mousemove', showPill, { passive: true });
    document.addEventListener('touchstart',showPill, { passive: true });
    showPill(); // show for first 3s then auto-hide
    floatingPill.addEventListener('mouseenter', () => { floatingPill.classList.remove('hidden'); clearTimeout(hideTimer); });
    floatingPill.addEventListener('mouseleave', () => { hideTimer = setTimeout(() => floatingPill.classList.add('hidden'), 2000); });
  }
}

/* ==========================================================================
   1. Navbar Scroll Effect
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = drawer.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isActive);
  });

  // Close when clicking a link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. Hero 3D Parallax & Gentle Mouse Follow
   ========================================================================== */
function initHeroParallax() {
  const heroVisual = document.querySelector('.hero-visual-wrapper');
  const stage = document.querySelector('.dashboard-stage');
  const floatGuide = document.querySelector('.float-ai-guide');
  const floatSprint = document.querySelector('.float-study-sprint');
  const floatXP = document.querySelector('.float-xp-badge');

  if (!heroVisual || !stage) return;

  // Check if reduced motion is requested
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    stage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    if (floatGuide) {
      floatGuide.style.transform = `translate(${-(x - centerX) * 0.04}px, ${-(y - centerY) * 0.04}px) rotate(1deg)`;
    }
    if (floatSprint) {
      floatSprint.style.transform = `translate(${(x - centerX) * 0.03}px, ${(y - centerY) * 0.03}px) rotate(-1deg)`;
    }
    if (floatXP) {
      floatXP.style.transform = `translate(${-(x - centerX) * 0.02}px, ${(y - centerY) * 0.02}px)`;
    }
  });

  heroVisual.addEventListener('mouseleave', () => {
    stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
    if (floatGuide) floatGuide.style.transform = 'translate(0px, 0px) rotate(1deg)';
    if (floatSprint) floatSprint.style.transform = 'translate(0px, 0px) rotate(-1deg)';
    if (floatXP) floatXP.style.transform = 'translate(0px, 0px)';
  });
}

/* ==========================================================================
   4. Scroll-Triggered Reveals
   ========================================================================== */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Interactive Roadmap Timeline & Scroll Progress
   ========================================================================== */
function initRoadmapTimeline() {
  const trackWrapper = document.querySelector('.timeline-track-wrapper');
  const lineProgress = document.querySelector('.timeline-line-progress');
  if (!trackWrapper || !lineProgress) return;

  const updateLineProgress = () => {
    const rect = trackWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const visibleDistance = windowHeight - rect.top;
      const totalDistance = windowHeight + rect.height;
      const rawPercent = (visibleDistance / totalDistance) * 100;
      const clampedPercent = Math.min(Math.max(rawPercent * 1.15, 15), 100);
      lineProgress.style.height = `${clampedPercent}%`;
    }
  };

  window.addEventListener('scroll', updateLineProgress, { passive: true });
  updateLineProgress();
}

/* ==========================================================================
   6. Roadmap Archetype Switcher (Dynamic Career Personas)
   ========================================================================== */
const ROADMAP_DATA = {
  software: {
    title: "AI & Software Engineer",
    stages: [
      {
        num: "01",
        stageTag: "Where You Are: Foundations",
        heading: "Core Coding & Computer Science Mastery",
        desc: "Build computational intuition with Python & TypeScript, discrete math, and core data structures. Begin solving algorithm challenges with clarity instead of rote memorization.",
        tags: ["Python 3.12", "Data Structures", "Git & GitHub", "Clean Code Fundamentals"]
      },
      {
        num: "02",
        stageTag: "Phase 2: Applied Acceleration",
        heading: "Fullstack Architecture & Modern AI APIs",
        desc: "Construct end-to-end fullstack applications utilizing Next.js, FastAPI, vector databases, and LLM orchestration tools (LangChain / LlamaIndex).",
        tags: ["Vector DBs (Pinecone)", "REST & GraphQL", "PyTorch Basics", "Database Design"]
      },
      {
        num: "03",
        stageTag: "Phase 3: Real-World Experience",
        heading: "Open-Source Contributions & Tech Internships",
        desc: "Land high-impact student software internships. Lead a tech team in hackathons, publish open-source libraries, and optimize production cloud latency.",
        tags: ["Docker & CI/CD", "Distributed Systems", "Summer Internship", "System Design Mocks"]
      },
      {
        num: "04",
        stageTag: "Where You Want To Be: Career Launch",
        heading: "High-Impact AI Engineer or Startup Founder",
        desc: "Step confidently into high-demand roles at top AI labs, tech giants, or venture-backed startups with competitive compensation and autonomy.",
        tags: ["\$135k-\$165k Starting", "Lead Product Ownership", "Continuous Mentorship"]
      }
    ]
  },
  design: {
    title: "Product & UX Designer",
    stages: [
      {
        num: "01",
        stageTag: "Where You Are: Foundations",
        heading: "Visual Hierarchy & Human Interaction Principles",
        desc: "Learn spatial typography, color theory, accessibility standards (WCAG AAA), and design systems in Figma. Understand how humans process visual information.",
        tags: ["Figma Design Systems", "Typography & Grids", "User Psychology", "WCAG Accessibility"]
      },
      {
        num: "02",
        stageTag: "Phase 2: Applied Acceleration",
        heading: "AI-Native Prototyping & User Research",
        desc: "Conduct qualitative user interviews, synthesize mental models, and build high-fidelity interactive prototypes incorporating generative AI workflows.",
        tags: ["Framer / Protopie", "Generative UI", "Usability Testing", "Design Tokens"]
      },
      {
        num: "03",
        stageTag: "Phase 3: Real-World Experience",
        heading: "Product Sprints & Cross-Functional Collaboration",
        desc: "Collaborate closely with engineers and product managers during summer internships. Ship consumer-facing features with quantifiable retention uplift.",
        tags: ["A/B Testing", "Cross-Functional Handoff", "Design Portfolio Review", "User Metrics"]
      },
      {
        num: "04",
        stageTag: "Where You Want To Be: Career Launch",
        heading: "AI Product Designer at Premier Tech Brands",
        desc: "Lead interaction design for innovative software experiences, defining how millions interact with intelligent agents, spatial computing, or digital platforms.",
        tags: ["\$120k-\$145k Starting", "Principal Portfolio", "Product Strategy Voice"]
      }
    ]
  },
  biotech: {
    title: "Biotech & Healthcare Innovator",
    stages: [
      {
        num: "01",
        stageTag: "Where You Are: Foundations",
        heading: "Molecular Biology & Quantitative Chemistry",
        desc: "Master cellular biology, biochemistry, linear algebra, and introductory bioinformatics. Establish wet lab safety certifications and meticulous lab notebook rigor.",
        tags: ["Molecular Genetics", "Organic Chemistry", "Intro Biostatistics", "Wet Lab Protocol"]
      },
      {
        num: "02",
        stageTag: "Phase 2: Applied Acceleration",
        heading: "Computational Biology & Genomic Data Analysis",
        desc: "Utilize R and Python (BioPython) to analyze RNA sequencing data, simulate molecular docking, and explore CRISPR gene-editing protocols.",
        tags: ["BioPython", "RNA-Seq Analysis", "AlphaFold Modeling", "Genomic Pipelines"]
      },
      {
        num: "03",
        stageTag: "Phase 3: Real-World Experience",
        heading: "University Research Fellowships & BioPharma Co-ops",
        desc: "Co-author peer-reviewed research in university oncology or neurobiology labs. Join innovative therapeutics startups for clinical trial observation.",
        tags: ["Undergrad Fellowship", "Pre-print Publication", "Clinical Data Ethics", "Poster Presentation"]
      },
      {
        num: "04",
        stageTag: "Where You Want To Be: Career Launch",
        heading: "Biotech Research Scientist or MedTech Founder",
        desc: "Lead breakthroughs at forefront institutions like Genentech, Moderna, or top PhD programs targeting personalized medicine and longevity.",
        tags: ["\$125k-\$150k Starting", "Translational Medicine", "Patented Therapeutics"]
      }
    ]
  },
  climate: {
    title: "Climate & Clean Energy Analyst",
    stages: [
      {
        num: "01",
        stageTag: "Where You Are: Foundations",
        heading: "Environmental Earth Systems & Data Analytics",
        desc: "Gain deep grounding in thermodynamics, atmospheric sciences, environmental policy, and spatial GIS (Geographic Information Systems) mapping.",
        tags: ["GIS Mapping", "Atmospheric Physics", "Energy Economics", "SQL & Data Modeling"]
      },
      {
        num: "02",
        stageTag: "Phase 2: Applied Acceleration",
        heading: "Grid Modernization & Carbon Lifecycle Analysis",
        desc: "Model grid storage feasibility for solar/wind, evaluate carbon accounting methodologies, and forecast renewable project returns.",
        tags: ["LCA Methodologies", "Python Energy Models", "Battery Chemistry", "ESG Frameworks"]
      },
      {
        num: "03",
        stageTag: "Phase 3: Real-World Experience",
        heading: "CleanTech Fellowships & Grid Analytics Internships",
        desc: "Partner with municipal energy authorities, climate tech accelerators, or venture firms evaluating next-generation geothermal and battery startups.",
        tags: ["Grid Interconnection", "Climate Policy Briefs", "Venture Diligence", "Field Deployments"]
      },
      {
        num: "04",
        stageTag: "Where You Want To Be: Career Launch",
        heading: "Clean Energy Strategist or Climate Tech Lead",
        desc: "Direct corporate decarbonization plans, drive venture funding for gigawatt clean power plants, or pioneer carbon-negative technologies.",
        tags: ["\$115k-\$140k Starting", "Global Impact", "Policy Influence"]
      }
    ]
  }
};

function initRoadmapArchetypeSwitcher() {
  const tabs = document.querySelectorAll('.roadmap-tab');
  const items = document.querySelectorAll('.timeline-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const archetypeKey = tab.dataset.archetype;
      const data = ROADMAP_DATA[archetypeKey];
      if (!data) return;

      // Animate update
      items.forEach((item, index) => {
        const stageData = data.stages[index];
        if (!stageData) return;

        const card = item.querySelector('.timeline-card');
        card.style.opacity = '0.3';
        card.style.transform = 'translateY(10px)';

        setTimeout(() => {
          const tagEl = card.querySelector('.timeline-stage-tag');
          const titleEl = card.querySelector('h4');
          const descEl = card.querySelector('p');
          const tagsWrapper = card.querySelector('.timeline-action-tags');

          if (tagEl) tagEl.textContent = stageData.stageTag;
          if (titleEl) titleEl.textContent = stageData.heading;
          if (descEl) descEl.textContent = stageData.desc;

          if (tagsWrapper) {
            tagsWrapper.innerHTML = stageData.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('');
          }

          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 180);
      });
    });
  });
}

/* ==========================================================================
   7. Interactive Mini-Mocks in "How Skily Helps"
   ========================================================================== */
function initFeaturesMiniMocks() {
  // Mini Mock 2: Career Tags clickable exploration
  const tags = document.querySelectorAll('.mock-clickable-tag');
  const outputRole = document.getElementById('mock-career-role');
  const outputMatch = document.getElementById('mock-career-match');

  const careerCombos = {
    'Design': { role: 'Product Experience Architect', match: '97%' },
    'AI': { role: 'AI Alignment & Prompt Engineer', match: '98%' },
    'Ethics': { role: 'AI Policy & Tech Ethicist', match: '95%' },
    'Bio': { role: 'Computational Genomics Scientist', match: '96%' },
    'Impact': { role: 'Climate Tech Operations Lead', match: '94%' }
  };

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const text = tag.textContent.trim();
      const matchData = careerCombos[text] || { role: `${text} Specialist`, match: '94%' };

      if (outputRole) {
        outputRole.style.opacity = '0';
        setTimeout(() => {
          outputRole.textContent = matchData.role;
          outputRole.style.opacity = '1';
        }, 150);
      }

      if (outputMatch) {
        outputMatch.textContent = matchData.match;
      }
    });
  });
}

/* ==========================================================================
   8. Roadmap Blueprint Maker (Interactive, Flexible & Accessible)
   ========================================================================== */
function initRoadmapGeneratorWizard() {
  const wizardContainer = document.querySelector('.generator-wizard-card');
  if (!wizardContainer) return;

  // State
  let currentStep = 1;
  const state = {
    eduLevel: 'Undergraduate',
    yearGrade: '2nd Year (Sophomore)',
    fieldStudy: 'Computer Science',
    location: 'United States & Canada',
    skillLevel: 'Intermediate',
    careerGoal: 'AI & Machine Learning Engineer',
    interests: ['Technology & AI', 'Design & Creative Arts', 'Science & Research'],
    studyTime: '2 hours / day (10–14 hrs/wk)',
    learningStyle: 'Mix of all (Balanced multimedia)',
    pace: 'Steady (Consistent weekly habits)',
    roadmapLength: '3 Months',
    modules: {
      milestones: true,
      topics: true,
      skills: true,
      projects: true,
      courses: true,
      portfolio: true,
      internship: true,
      exploration: true,
      checkpoints: true,
      nextsteps: true
    },
    completedTasks: new Set()
  };

  // Prepopulated Careers List for Searchable Combobox
  const CAREER_DATABASE = [
    'AI & Machine Learning Engineer',
    'Full-Stack Web Developer',
    'Product & UX/UI Designer',
    'Data Scientist & Analytics Specialist',
    'Cloud & DevOps Systems Architect',
    'Cybersecurity & Ethical Defense Architect',
    'Bioinformatician & Genomic Researcher',
    'Climate Tech & Clean Energy Lead',
    'Quantitative Finance & Algorithmic Analyst',
    'Product Manager (Tech & Growth)',
    'Mobile App Developer (iOS & Android)',
    'Healthcare & Medical Tech Specialist',
    'Creative Technologist & 3D Interactive Dev',
    'Neuroscience & Cognitive AI Researcher',
    'EdTech & Learning Experience Designer',
    'Blockchain & Decentralized Systems Engineer',
    'Robotics & Autonomous Systems Engineer',
    'Digital Marketing & Growth Strategist'
  ];

  // Dynamic Year / Grade Options by Education Level
  const YEAR_GRADE_BY_EDU = {
    'School': [
      '9th Grade (Freshman)',
      '10th Grade (Sophomore)',
      '11th Grade (Junior)',
      '12th Grade (Senior)'
    ],
    'Undergraduate': [
      '1st Year (Freshman)',
      '2nd Year (Sophomore)',
      '3rd Year (Junior)',
      'Final Year (Senior)'
    ],
    'Postgraduate': [
      '1st Year Master’s',
      '2nd Year Master’s',
      'PhD Candidate (Yr 1–2)',
      'PhD Candidate (Thesis Stage)'
    ],
    'Other': [
      'Self-Paced Exploration',
      'Career Pivot (Month 1–3)',
      'Bootcamp / Intensive Reskilling',
      'Working Professional Advancement'
    ]
  };

  // DOM Elements
  const stepIndicators = wizardContainer.querySelectorAll('.step-indicator-item');
  const contentSteps = wizardContainer.querySelectorAll('.wizard-content-step');
  const formNav = document.getElementById('wizard-form-nav');
  const loadingScreen = document.getElementById('wizard-loading-screen');
  const resultsView = document.getElementById('wizard-results-view');
  const nextBtn = document.getElementById('wizard-next-btn');
  const prevBtn = document.getElementById('wizard-prev-btn');

  // Step 1 Elements
  const eduLevelSelect = document.getElementById('profile-edu-level');
  const yearGradeSelect = document.getElementById('profile-year-grade');
  const fieldStudyInput = document.getElementById('profile-field-study');
  const locationSelect = document.getElementById('profile-location');
  const fieldChips = document.querySelectorAll('.quick-chip[data-field]');
  const skillChips = document.querySelectorAll('#skill-level-chips .multi-chip-item');

  // Step 2 Elements
  const careerInput = document.getElementById('career-search-input');
  const careerDropdown = document.getElementById('career-dropdown-list');
  const careerClearBtn = document.getElementById('career-clear-btn');
  const stillExploringBtn = document.getElementById('btn-still-exploring');
  const careerSelectedBadge = document.getElementById('career-selected-badge');
  const interestChips = document.querySelectorAll('#interest-chips-container .multi-chip-item');
  const interestCountHint = document.getElementById('interest-count-hint');

  // Step 3 Elements
  const studyTimeSelect = document.getElementById('pref-study-time');
  const learningStyleSelect = document.getElementById('pref-learning-style');
  const paceSelect = document.getElementById('pref-pace');
  const roadmapLengthSelect = document.getElementById('pref-roadmap-length');

  // Step 4 Elements
  const moduleCheckboxes = document.querySelectorAll('input[name="module-toggle"]');
  const selectAllModulesBtn = document.getElementById('btn-select-all-modules');
  const resetModulesBtn = document.getElementById('btn-reset-modules');

  // Results Action Elements
  const editAnswersBtn = document.getElementById('btn-edit-answers');
  const regenerateBtn = document.getElementById('btn-regenerate-roadmap');
  const saveBtn = document.getElementById('btn-save-roadmap');
  const printBtn = document.getElementById('btn-print-roadmap');
  const copyMarkdownBtn = document.getElementById('btn-copy-markdown');

  /* --------------------------------------------------------------------------
     1. Initialize Follow-up Listeners
     -------------------------------------------------------------------------- */
  // Education Level Change -> Update Year / Grade
  if (eduLevelSelect && yearGradeSelect) {
    eduLevelSelect.addEventListener('change', () => {
      const selectedEdu = eduLevelSelect.value;
      state.eduLevel = selectedEdu;
      const options = YEAR_GRADE_BY_EDU[selectedEdu] || YEAR_GRADE_BY_EDU['Undergraduate'];

      yearGradeSelect.innerHTML = options.map((opt, i) => 
        `<option value="${opt}" ${i === 1 ? 'selected' : ''}>${opt}</option>`
      ).join('');
      state.yearGrade = yearGradeSelect.value;
    });
  }

  if (yearGradeSelect) {
    yearGradeSelect.addEventListener('change', () => {
      state.yearGrade = yearGradeSelect.value;
    });
  }

  // Field of Study text and suggestion chips
  if (fieldStudyInput) {
    fieldStudyInput.addEventListener('input', () => {
      state.fieldStudy = fieldStudyInput.value.trim() || 'General Studies';
    });
  }

  fieldChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const fieldVal = chip.dataset.field;
      if (fieldStudyInput && fieldVal) {
        fieldStudyInput.value = fieldVal;
        state.fieldStudy = fieldVal;
      }
    });
  });

  if (locationSelect) {
    locationSelect.addEventListener('change', () => {
      state.location = locationSelect.value;
    });
  }

  // Skill Level Chips (Single Select)
  skillChips.forEach(chip => {
    chip.addEventListener('click', () => {
      skillChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.skillLevel = chip.dataset.skill || 'Intermediate';
    });
  });

  /* --------------------------------------------------------------------------
     2. Searchable Career Combobox
     -------------------------------------------------------------------------- */
  function renderCareerDropdown(filterText = '') {
    if (!careerDropdown) return;
    const cleanFilter = filterText.toLowerCase().trim();
    const filtered = CAREER_DATABASE.filter(c => c.toLowerCase().includes(cleanFilter));

    let html = '';
    filtered.forEach(c => {
      html += `<div class="combobox-item" data-career="${c}"><span>${c}</span><span>→</span></div>`;
    });

    if (cleanFilter.length > 0 && !CAREER_DATABASE.map(c => c.toLowerCase()).includes(cleanFilter)) {
      html += `
        <div class="combobox-item exploring-action" data-career="${filterText.trim()}">
          <span>+ Use "${filterText.trim()}" as Custom Career Goal</span>
          <span>✦ Custom</span>
        </div>
      `;
    }

    if (filtered.length === 0 && cleanFilter.length === 0) {
      CAREER_DATABASE.forEach(c => {
        html += `<div class="combobox-item" data-career="${c}"><span>${c}</span><span>→</span></div>`;
      });
    }

    careerDropdown.innerHTML = html;
    careerDropdown.classList.add('open');

    // Attach click events
    careerDropdown.querySelectorAll('.combobox-item').forEach(item => {
      item.addEventListener('click', () => {
        const selectedCareer = item.dataset.career;
        if (selectedCareer && careerInput) {
          careerInput.value = selectedCareer;
          state.careerGoal = selectedCareer;
          if (careerSelectedBadge) {
            careerSelectedBadge.textContent = `Selected Goal: ${selectedCareer}`;
          }
          careerDropdown.classList.remove('open');
        }
      });
    });
  }

  if (careerInput) {
    careerInput.addEventListener('focus', () => renderCareerDropdown(careerInput.value));
    careerInput.addEventListener('input', () => {
      state.careerGoal = careerInput.value.trim() || 'AI & Machine Learning Engineer';
      renderCareerDropdown(careerInput.value);
      if (careerSelectedBadge) {
        careerSelectedBadge.textContent = `Selected Goal: ${state.careerGoal}`;
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('career-combobox-wrapper');
      if (wrapper && !wrapper.contains(e.target) && careerDropdown) {
        careerDropdown.classList.remove('open');
      }
    });
  }

  if (careerClearBtn && careerInput) {
    careerClearBtn.addEventListener('click', () => {
      careerInput.value = '';
      careerInput.focus();
      renderCareerDropdown('');
    });
  }

  if (stillExploringBtn && careerInput) {
    stillExploringBtn.addEventListener('click', () => {
      const exploratoryGoal = 'Broad Exploration & Career Discovery';
      careerInput.value = exploratoryGoal;
      state.careerGoal = exploratoryGoal;
      if (careerSelectedBadge) {
        careerSelectedBadge.textContent = `Selected Goal: ${exploratoryGoal}`;
      }
      if (careerDropdown) careerDropdown.classList.remove('open');
      showToast('🧭 Set to Exploratory Discovery Track! We will customize broad cross-disciplinary milestones.');
    });
  }

  /* --------------------------------------------------------------------------
     3. Multi-Select Interest Chips
     -------------------------------------------------------------------------- */
  interestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const selected = Array.from(document.querySelectorAll('#interest-chips-container .multi-chip-item.selected'))
        .map(c => c.dataset.interest);

      if (selected.length === 0) {
        // Keep at least one selected
        chip.classList.add('selected');
        state.interests = [chip.dataset.interest];
      } else {
        state.interests = selected;
      }

      if (interestCountHint) {
        interestCountHint.textContent = `${state.interests.length} selected`;
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Learning Preferences (Step 3)
     -------------------------------------------------------------------------- */
  if (studyTimeSelect) {
    studyTimeSelect.addEventListener('change', () => { state.studyTime = studyTimeSelect.value; });
  }
  if (learningStyleSelect) {
    learningStyleSelect.addEventListener('change', () => { state.learningStyle = learningStyleSelect.value; });
  }
  if (paceSelect) {
    paceSelect.addEventListener('change', () => { state.pace = paceSelect.value; });
  }
  if (roadmapLengthSelect) {
    roadmapLengthSelect.addEventListener('change', () => { state.roadmapLength = roadmapLengthSelect.value; });
  }

  /* --------------------------------------------------------------------------
     5. Module Customization Toggles (Step 4)
     -------------------------------------------------------------------------- */
  moduleCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      state.modules[cb.value] = cb.checked;
    });
  });

  if (selectAllModulesBtn) {
    selectAllModulesBtn.addEventListener('click', () => {
      moduleCheckboxes.forEach(cb => {
        cb.checked = true;
        state.modules[cb.value] = true;
      });
    });
  }

  if (resetModulesBtn) {
    resetModulesBtn.addEventListener('click', () => {
      moduleCheckboxes.forEach(cb => {
        cb.checked = true;
        state.modules[cb.value] = true;
      });
      showToast('Reset modules to default comprehensive configuration.');
    });
  }

  /* --------------------------------------------------------------------------
     6. Step-by-Step Wizard Navigation & Validation
     -------------------------------------------------------------------------- */
  function showStep(step) {
    currentStep = step;
    contentSteps.forEach(cs => cs.classList.remove('active'));
    stepIndicators.forEach((ind, i) => {
      if (i + 1 <= step) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });

    const activeContent = document.getElementById(`wizard-step-${step}`);
    if (activeContent) activeContent.classList.add('active');

    if (prevBtn) {
      prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
      nextBtn.textContent = step === 4 ? 'Generate My Custom Blueprint ✨' : 'Continue →';
    }
  }

  function validateCurrentStep(step) {
    if (step === 1) {
      if (!fieldStudyInput || !fieldStudyInput.value.trim()) {
        showToast('⚠️ Please enter or select your field of study or stream.');
        if (fieldStudyInput) fieldStudyInput.focus();
        return false;
      }
    } else if (step === 2) {
      if (!careerInput || !careerInput.value.trim()) {
        showToast('⚠️ Please select or type your target career goal.');
        if (careerInput) careerInput.focus();
        return false;
      }
      if (state.interests.length === 0) {
        showToast('⚠️ Please select at least one interest area.');
        return false;
      }
    }
    return true;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!validateCurrentStep(currentStep)) return;

      if (currentStep < 4) {
        showStep(currentStep + 1);
      } else {
        // Trigger Generation
        runBlueprintGeneration();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Blueprint Generation Engine
     -------------------------------------------------------------------------- */
  function runBlueprintGeneration() {
    // Hide form & steps
    contentSteps.forEach(cs => cs.classList.remove('active'));
    if (formNav) formNav.style.display = 'none';
    const indicator = document.getElementById('blueprint-steps-indicator');
    if (indicator) indicator.style.display = 'none';

    // Show loading
    if (loadingScreen) loadingScreen.classList.add('active');

    const statusTexts = [
      `Analyzing academic profile: ${state.eduLevel} (${state.yearGrade}) in ${state.fieldStudy}...`,
      `Synthesizing 2026 industry demand for ${state.careerGoal}...`,
      `Calibrating study schedule for ${state.studyTime} and ${state.learningStyle}...`,
      `Finalizing ${state.roadmapLength} roadmap across 4 progressive milestone phases...`
    ];

    const genText = document.getElementById('generating-dynamic-text');
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < statusTexts.length && genText) {
        genText.textContent = statusTexts[idx];
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      if (loadingScreen) loadingScreen.classList.remove('active');
      renderGeneratedResults();
    }, 1600);
  }

  /* --------------------------------------------------------------------------
     8. Render Multi-Phase Results Card
     -------------------------------------------------------------------------- */
  function renderGeneratedResults() {
    if (!resultsView) return;
    resultsView.classList.add('active');

    // Header Meta
    const titleEl = document.getElementById('result-plan-title');
    const subtitleEl = document.getElementById('result-plan-subtitle');
    const badgeEl = document.getElementById('result-plan-badge');

    if (titleEl) {
      titleEl.textContent = `Custom ${state.careerGoal} Roadmap`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = `${state.eduLevel} • ${state.yearGrade} • ${state.fieldStudy} • ${state.roadmapLength} Plan`;
    }
    if (badgeEl) {
      badgeEl.textContent = `${state.skillLevel} Level • ${state.pace}`;
    }

    // Timeframe nomenclature based on chosen roadmap length
    let phaseTimeframes = ['Weeks 1–3', 'Weeks 4–6', 'Weeks 7–9', 'Weeks 10–12'];
    if (state.roadmapLength === '30 Days') {
      phaseTimeframes = ['Days 1–7 (Sprint 1)', 'Days 8–15 (Sprint 2)', 'Days 16–23 (Sprint 3)', 'Days 24–30 (Launch)'];
    } else if (state.roadmapLength === '6 Months') {
      phaseTimeframes = ['Month 1–2 (Core)', 'Month 3–4 (Systems)', 'Month 5 (Applied)', 'Month 6 (Capstone)'];
    } else if (state.roadmapLength === '1 Year') {
      phaseTimeframes = ['Quarter 1 (Foundations)', 'Quarter 2 (Systems Build)', 'Quarter 3 (Internship Prep)', 'Quarter 4 (Career Launch)'];
    }

    // Curated content tailored to career & student background
    const phasesData = generatePhasesData(state, phaseTimeframes);
    const container = document.getElementById('roadmap-phases-container');
    if (!container) return;

    let phasesHtml = '';
    let totalTaskCount = 0;
    state.completedTasks.clear();

    phasesData.forEach((phase, phaseIndex) => {
      totalTaskCount += phase.tasks.length;

      phasesHtml += `
        <div class="phase-card" data-phase-index="${phaseIndex}">
          <div class="phase-header-row">
            <div class="phase-title-group">
              <span class="section-badge" style="margin-bottom: 6px; font-size: 0.72rem; padding: 2px 10px;">
                Phase 0${phaseIndex + 1}
              </span>
              <h4>${phase.title}</h4>
            </div>
            <div style="text-align: right;">
              <span class="phase-timeframe-tag">${phase.timeframe}</span>
            </div>
          </div>

          <!-- Specific Learning Goals -->
          ${state.modules.milestones ? `
            <div class="phase-goals-box">
              <h6>Target Milestone Goals</h6>
              <ul>
                ${phase.goals.map(g => `<li>${g}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Actionable Tasks Checklist -->
          <div class="phase-tasks-box">
            <h6>
              <span>Actionable Tasks (${phase.tasks.length})</span>
              <span style="font-size: 0.75rem; color: #64748b; font-weight: normal;">Click to mark complete</span>
            </h6>
            <ul class="task-checklist">
              ${phase.tasks.map((task, taskIdx) => {
                const taskId = `task-${phaseIndex}-${taskIdx}`;
                return `
                  <li class="task-item-row" id="row-${taskId}">
                    <input type="checkbox" class="task-checkbox-input" id="${taskId}" data-task-id="${taskId}">
                    <label class="task-text" for="${taskId}">${task}</label>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>

          <!-- Skills to Practice -->
          ${state.modules.skills ? `
            <div style="margin-bottom: 18px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-navy-800); margin-bottom: 6px;">
                Skills to Practice & Cement:
              </div>
              <div class="phase-skills-row">
                ${phase.skills.map(s => `<span class="phase-skill-pill">${s}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Small Project & How to Measure Progress -->
          <div class="phase-modules-grid">
            ${state.modules.projects ? `
              <div class="phase-module-card">
                <h6>🔨 Hands-on Project Challenge</h6>
                <p><strong>${phase.project.name}:</strong> ${phase.project.desc}</p>
              </div>
            ` : ''}

            ${state.modules.checkpoints ? `
              <div class="phase-module-card">
                <h6>📏 How to Measure Progress</h6>
                <p><strong>Verification Checkpoint:</strong> ${phase.measureProgress}</p>
              </div>
            ` : ''}

            ${state.modules.courses ? `
              <div class="phase-module-card">
                <h6>📚 Recommended Resources</h6>
                <p>${phase.learningResources}</p>
              </div>
            ` : ''}

            ${state.modules.portfolio ? `
              <div class="phase-module-card">
                <h6>💼 Portfolio Deliverable</h6>
                <p>${phase.portfolioTask}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = phasesHtml;

    // Suggested Next Steps Visibility
    const nextStepsBox = document.getElementById('roadmap-next-steps-container');
    if (nextStepsBox) {
      nextStepsBox.style.display = state.modules.nextsteps ? 'block' : 'none';
      const nextStepsText = document.getElementById('roadmap-next-steps-text');
      if (nextStepsText) {
        nextStepsText.textContent = `Upon completing this ${state.roadmapLength} blueprint for ${state.careerGoal}, begin targeting verified internship/job applications in ${state.location}, submit your capstone code for peer code reviews, and schedule informational interviews with working alumni in ${state.interests[0] || 'Tech'}.`;
      }
    }

    // Attach Task Checkbox Listeners
    attachTaskCheckboxes(totalTaskCount);

    // Confetti celebration
    launchConfetti();
    showToast(`✨ Generated your tailored ${state.roadmapLength} blueprint for ${state.careerGoal}!`);
  }

  /* --------------------------------------------------------------------------
     9. Interactive Task Checkbox Handlers & Live Progress Bar
     -------------------------------------------------------------------------- */
  function attachTaskCheckboxes(totalTasks) {
    const checkboxes = document.querySelectorAll('.task-checkbox-input');
    const progressFill = document.getElementById('live-progress-fill');
    const progressText = document.getElementById('progress-percentage-text');

    const updateProgress = () => {
      const completedCount = state.completedTasks.size;
      const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressText) {
        progressText.textContent = `${completedCount} of ${totalTasks} tasks completed (${percent}%)`;
      }

      if (completedCount === totalTasks && totalTasks > 0) {
        launchConfetti();
        showToast('🏆 Incredible milestone! You marked all tasks in your blueprint complete!');
      }
    };

    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const row = document.getElementById(`row-${cb.id}`);
        if (cb.checked) {
          state.completedTasks.add(cb.id);
          if (row) row.classList.add('completed');
        } else {
          state.completedTasks.delete(cb.id);
          if (row) row.classList.remove('completed');
        }
        updateProgress();
      });
    });

    updateProgress();
  }

  /* --------------------------------------------------------------------------
     10. Dynamic Content Generation Factory
     -------------------------------------------------------------------------- */
  function generatePhasesData(st, timeframes) {
    const isExploratory = st.careerGoal.toLowerCase().includes('explor') || st.careerGoal.toLowerCase().includes('discovery');
    const primaryInterest = st.interests[0] || 'Technology';

    return [
      {
        timeframe: timeframes[0],
        title: isExploratory ? 'Exploration & Core Fundamentals' : `Phase 1: Foundations & ${primaryInterest} Tooling`,
        goals: [
          `Build structured computational and domain intuition in ${st.fieldStudy}`,
          `Master modern command-line tools, Git workflows, and documentation rigor`,
          `Set up sustainable ${st.studyTime} habits using active recall pacing`
        ],
        tasks: [
          `Set up development environment with Git, VSCode, and core language runtimes`,
          `Complete 5 foundational exercises and document solutions in a structured README`,
          `Conduct 2 informational reads on emerging 2026 industry shifts in ${st.careerGoal}`,
          `Establish a dedicated Pomodoro block tracking focus hours weekly`
        ],
        skills: ['Foundational Syntax', 'Git Version Control', 'CLI Navigation', 'System Design Thinking', 'Active Recall'],
        project: {
          name: isExploratory ? 'Curiosity Discovery Log & Micro-Prototype' : 'Foundational Mini-Tool & CLI Utility',
          desc: 'Build an interactive console or web micro-utility that solves a daily student friction point, verified with clean documentation.'
        },
        measureProgress: 'Pass self-graded diagnostic checkpoint quiz with >85% accuracy and publish initial repository to GitHub.',
        learningResources: st.learningStyle.includes('Videos') 
          ? 'FreeCodeCamp Video Sprints, MIT OpenCourseWare Video Lectures, and CrashCourse.'
          : 'Official Language Documentation, O’Reilly Guides, and interactive online documentation.',
        portfolioTask: 'Publish clean GitHub repository with architectural README, installation guide, and passing tests.'
      },
      {
        timeframe: timeframes[1],
        title: isExploratory ? 'Phase 2: Deep-Dive Hands-On Experiments' : `Phase 2: Applied Architecture & Systems for ${st.careerGoal}`,
        goals: [
          `Synthesize multi-tier application logic incorporating modern APIs and state`,
          `Conduct real-world data analysis and asynchronous workflow orchestration`,
          `Transition from guided tutorials to independent architectural problem-solving`
        ],
        tasks: [
          `Design a modular system architecture diagram with data flow specifications`,
          `Build end-to-end integration with at least 1 external REST or Vector API`,
          `Refactor codebase adhering to clean code standards and strict linting rules`,
          `Submit code for automated testing or peer review on community Discord/campus group`
        ],
        skills: ['REST & GraphQL APIs', 'Asynchronous Logic', 'Database Schema Design', 'Error Handling', 'Unit Testing'],
        project: {
          name: 'Interactive Full-Stack Web Application / API Engine',
          desc: `Develop a responsive application that allows users to interact with live data models customized for ${st.careerGoal}.`
        },
        measureProgress: 'Deploy live version to Vercel/Cloudflare with zero console errors and 90+ Lighthouse accessibility score.',
        learningResources: 'FullstackOpen, MDN Web Docs, Scrimba Interactive Sandboxes, and domain-specific YouTube deep dives.',
        portfolioTask: 'Record a 2-minute Loom walkthrough explaining architectural decisions and database tradeoffs.'
      },
      {
        timeframe: timeframes[2],
        title: `Phase 3: Production Hardening, Testing & Polish`,
        goals: [
          `Optimize performance, load latency, and edge case resiliency`,
          `Incorporate real-world feedback from 5 beta testers or student classmates`,
          `Prepare technical interview storytelling using the STAR behavioral framework`
        ],
        tasks: [
          `Conduct load tests and optimize query bottlenecks to achieve <200ms latency`,
          `Write 10 comprehensive integration test suites for core application pathways`,
          `Prepare STAR-method case study writeup detailing obstacles, actions, and measurable results`,
          `Draft a tailored technical resume bullet point emphasizing quantifiable impact`
        ],
        skills: ['Performance Profiling', 'CI/CD Automation', 'STAR Storytelling', 'Cloud Observability', 'Technical Documentation'],
        project: {
          name: 'Production-Grade Showcase with Live User Telemetry',
          desc: 'Harden your project with persistent storage, authentication, and error telemetry (Sentry/PostHog).'
        },
        measureProgress: 'Acquire feedback from at least 3 peers or mentors and log benchmark metrics before and after refactoring.',
        learningResources: 'System Design Primer, Google Web Dev Performance Guides, and LeetCode Patterns Handbook.',
        portfolioTask: 'Publish an in-depth case study article on Medium/Substack breaking down technical challenges encountered.'
      },
      {
        timeframe: timeframes[3],
        title: `Phase 4: Capstone Launch & Career Placement Readiness`,
        goals: [
          `Finalize premier capstone deliverable demonstrating senior-level autonomy`,
          `Master technical coding mock interviews and live whiteboarding rounds`,
          `Submit early recruiting applications for summer internships or full-time roles`
        ],
        tasks: [
          `Complete final capstone project with public live URL and production monitoring`,
          `Conduct 3 live peer mock interviews simulating top-tier technical rounds`,
          `Reach out to 5 alumni working in ${st.careerGoal} for informal mentoring chats`,
          `Submit 15 strategic recruiting applications matching target location (${st.location})`
        ],
        skills: ['Live Whiteboarding', 'System Design Mocks', 'Alumni Networking', 'Offer Evaluation', 'Lifelong Learning'],
        project: {
          name: `Flagship ${st.careerGoal} Capstone Project`,
          desc: 'A comprehensive, end-to-end production artifact that demonstrates undeniable readiness for industry roles.'
        },
        measureProgress: 'Complete a 45-minute live technical presentation and mock behavioral defense with verified alumni mentor.',
        learningResources: 'Exponent Mock Interview Library, Cracking the Coding Interview, and GitHub Awesome Curated Lists.',
        portfolioTask: 'Deploy live personal portfolio site highlighting your 3 best projects with interactive live demos.'
      }
    ];
  }

  /* --------------------------------------------------------------------------
     11. Results Control Handlers (Edit, Regenerate, Save, Print, Copy)
     -------------------------------------------------------------------------- */
  // Edit Answers -> Returns to Form
  if (editAnswersBtn) {
    editAnswersBtn.addEventListener('click', () => {
      if (resultsView) resultsView.classList.remove('active');
      if (formNav) formNav.style.display = 'flex';
      const indicator = document.getElementById('blueprint-steps-indicator');
      if (indicator) indicator.style.display = 'flex';
      showStep(1);
      wizardContainer.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Regenerate
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', () => {
      if (resultsView) resultsView.classList.remove('active');
      runBlueprintGeneration();
    });
  }

  // Save Roadmap to LocalStorage
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const blueprintRecord = {
        savedAt: new Date().toISOString(),
        state: {
          ...state,
          completedTasks: Array.from(state.completedTasks)
        }
      };
      try {
        localStorage.setItem('skily_custom_blueprint', JSON.stringify(blueprintRecord));
        showToast('💾 Success! Your personalized roadmap and task progress were saved locally.');
      } catch (err) {
        showToast('💾 Roadmap saved to current session!');
      }
    });
  }

  // Print / PDF
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy Markdown
  if (copyMarkdownBtn) {
    copyMarkdownBtn.addEventListener('click', () => {
      const md = `
# ${state.careerGoal} — Personalized Skily Blueprint
**Education:** ${state.eduLevel} (${state.yearGrade}) | **Field:** ${state.fieldStudy}
**Timeline:** ${state.roadmapLength} (${state.pace}) | **Study Commitment:** ${state.studyTime}
**Location Target:** ${state.location} | **Skill Level:** ${state.skillLevel}
*Generated by Skily AI Career & Study Copilot (Demo Simulation)*

---
### Phase 1: Foundations & Core Concepts
- **Goals:** Computational rigor, Git toolchain, sustainable study habits.
- **Project:** Foundational Mini-Tool & CLI Utility.
- **Checklist:** Setup dev environment, complete 5 foundational exercises, establish Pomodoro logs.

### Phase 2: Applied Architecture & Systems
- **Goals:** Multi-tier application logic, API integration, data flow schemas.
- **Project:** Interactive Full-Stack Application.
- **Checklist:** Architecture schema, integrate REST/Vector API, refactor for clean code.

### Phase 3: Production Hardening & Polish
- **Goals:** Sub-200ms performance, CI/CD pipeline, STAR interview case study writeup.
- **Project:** Production-grade showcase with automated testing and telemetry.

### Phase 4: Capstone Launch & Career Placement
- **Goals:** Flagship Capstone deliverable, technical mock rounds, strategic recruiting outreach.
- **Project:** Flagship Production Capstone.
      `.trim();

      navigator.clipboard.writeText(md).then(() => {
        showToast('📋 Markdown summary copied to clipboard! Ready to paste into Notion or Docs.');
      }).catch(() => {
        showToast('📋 Roadmap summary ready in clipboard!');
      });
    });
  }

  // Initialize Step 1
  showStep(1);
}



/* ==========================================================================
   9. Career Path Modals (Rich Career Blueprints)
   ========================================================================== */
const CAREER_BLUEPRINTS = {
  "ai-designer": {
    title: "AI Product Designer",
    salary: "$118,000 - $152,000",
    growth: "+34% through 2030",
    overview: "AI Product Designers invent the intuitive surfaces through which humans communicate with artificial intelligence agents, autonomous workflows, and spatial interfaces.",
    dailySchedule: [
      "09:30 AM — Review prompt evaluation data & user friction logs",
      "11:00 AM — Figma design system sprint: Adaptive generative UI components",
      "02:00 PM — Usability testing session: Testing voice + text latency perception",
      "04:00 PM — Cross-functional sync with machine learning engineers"
    ],
    recommendedProject: "Build an AI-powered study buddy interface that automatically converts lecture audio into interactive visual concept flashcards."
  },
  "climate-engineer": {
    title: "Climate Tech Engineer",
    salary: "$112,000 - $145,000",
    growth: "+42% through 2030",
    overview: "Climate Tech Engineers design systems for grid-scale energy storage, geothermal capture, and industrial carbon abatement, turning scientific breakthroughs into infrastructure.",
    dailySchedule: [
      "09:00 AM — Review telemetry from grid battery storage facilities",
      "10:30 AM — Python energy dispatch modeling & capacity forecasting",
      "01:30 PM — Hardware sensor calibration lab session",
      "03:45 PM — Municipal energy transition stakeholder alignment"
    ],
    recommendedProject: "Design a regional renewable dispatch simulator calculating optimal solar-plus-storage sizing for community microgrids."
  },
  "neurotech": {
    title: "Neurotech & Cognitive Researcher",
    salary: "$130,000 - $168,000",
    growth: "+28% through 2030",
    overview: "Neurotech researchers bridge biology and computer science, developing non-invasive neural interfaces, assistive devices, and brain-computer interaction protocols.",
    dailySchedule: [
      "09:00 AM — EEG signal filtering & noise removal in Python (MNE-Python)",
      "11:15 AM — Subject participant cognitive experiment session",
      "02:00 PM — Neural decoding model training using convolutional neural nets",
      "04:30 PM — Academic lab group seminar on motor cortex decoding"
    ],
    recommendedProject: "Build an open-source EEG visualizer reading synthetic brainwave signals to control computer keyboard events without hands."
  },
  "cloud-security": {
    title: "Cloud & AI Security Architect",
    salary: "$135,000 - $175,000",
    growth: "+31% through 2030",
    overview: "Cloud & AI Security Architects safeguard enterprise infrastructure against adversarial machine learning attacks, prompt injection, and multi-cloud vulnerabilities.",
    dailySchedule: [
      "09:15 AM — Review automated vulnerability scans across AWS & Kubernetes",
      "11:00 AM — Threat modeling for autonomous agentic tool execution",
      "01:45 PM — Red team simulation: Testing prompt extraction vulnerabilities",
      "04:00 PM — Architecture review with infrastructure engineering team"
    ],
    recommendedProject: "Create a GitHub Action that automatically scans LangChain / OpenAI API wrappers for prompt leakage and secret exposure."
  },
  "bioinformatics": {
    title: "Bioinformatics Specialist",
    salary: "$115,000 - $148,000",
    growth: "+36% through 2030",
    overview: "Bioinformatics specialists apply data science, algorithms, and high-performance computing to solve genomic puzzles, protein folding challenges, and drug discovery.",
    dailySchedule: [
      "09:00 AM — Run high-throughput next-generation sequencing pipeline",
      "11:00 AM — Statistical variant calling and single-cell RNA analysis",
      "02:00 PM — AlphaFold protein structure alignment and visualization",
      "04:00 PM — Research presentation with clinical oncology collaborators"
    ],
    recommendedProject: "Build an interactive web dashboard analyzing COVID or Influenza mutation strains using NCBI public gene datasets."
  },
  "creative-technologist": {
    title: "Creative Technologist",
    salary: "$110,000 - $142,000",
    growth: "+29% through 2030",
    overview: "Creative Technologists blend creative storytelling, 3D graphics (Three.js/WebGL), physical computing, and real-time AI to build breathtaking digital installations.",
    dailySchedule: [
      "10:00 AM — Shader optimization and 60 FPS WebGL profiling",
      "12:00 PM — Generative audio-reactive canvas experiments",
      "02:30 PM — Physical sensor prototyping with microcontrollers",
      "04:45 PM — Client showcase of interactive brand experience"
    ],
    recommendedProject: "Create a web-based 3D sound synthesizer that generates dynamic geometric fractals based on microphone input frequencies."
  }
};

function initCareerModals() {
  const modalOverlay = document.getElementById('career-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modalOverlay) return;

  const titleEl = document.getElementById('modal-career-title');
  const salaryEl = document.getElementById('modal-career-salary');
  const growthEl = document.getElementById('modal-career-growth');
  const overviewEl = document.getElementById('modal-career-overview');
  const scheduleEl = document.getElementById('modal-career-schedule');
  const projectEl = document.getElementById('modal-career-project');

  document.querySelectorAll('[data-career-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.careerTarget;
      const data = CAREER_BLUEPRINTS[targetId];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      if (salaryEl) salaryEl.textContent = data.salary;
      if (growthEl) growthEl.textContent = data.growth;
      if (overviewEl) overviewEl.textContent = data.overview;

      if (scheduleEl) {
        scheduleEl.innerHTML = data.dailySchedule.map(item => `<li>${item}</li>`).join('');
      }
      if (projectEl) projectEl.textContent = data.recommendedProject;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   11. Call to Action Form Submission
   ========================================================================== */
function initCtaForm() {
  const ctaForm = document.getElementById('cta-signup-form');
  if (!ctaForm) return;

  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = ctaForm.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      showToast(`🎉 You're on the list! We sent a roadmap welcome pack to ${emailInput.value}`);
      emailInput.value = '';
    }
  });
}

/* ==========================================================================
   12. Toast Message Utility
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* ==========================================================================
   13. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   14. Celebratory Confetti Burst
   ========================================================================== */
function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#7c3aed', '#8b5cf6', '#0ea5e9', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'];
  const particles = Array.from({ length: 75 }).map(() => ({
    x: canvas.width / 2,
    y: canvas.height * 0.45,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10,
    opacity: 1
  }));

  let animFrame;
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;
      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animFrame);
      canvas.remove();
    }
  };
  render();
}

