/* ==========================================================================
   Apex Institute of Science & Technology (AIST) - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollEffects();
  initProgramExplorer();
  initTuitionCalculator();
  initCampusTabs();
  initAdmissionWizard();
  initCountdownTimer();
  initSpotlightSearch();
  initAiAssistant();
  initFormHandlers();
  initCounters();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const htmlTag = document.documentElement;

  const savedTheme = localStorage.getItem('aist_theme') || 'light';
  htmlTag.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('aist_theme', newTheme);
    updateThemeIcon(newTheme);

    showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (theme === 'dark') {
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    themeBtn.style.color = '#f59e0b';
  } else {
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeBtn.style.color = 'var(--text-main)';
  }
}

/* --------------------------------------------------------------------------
   2. Scroll Progress Bar & Navbar Styling
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    if (winScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Program Explorer & Curriculum Modal
   -------------------------------------------------------------------------- */
const PROGRAM_DATA = [
  {
    id: 'cs-ai',
    title: 'B.Tech Computer Science & AI',
    category: 'cs',
    duration: '4 Years',
    degree: 'Undergraduate',
    placement: '99% Placement',
    icon: 'fa-solid fa-brain',
    desc: 'Master deep learning, computer vision, natural language processing, and cloud architecture with hands-on labs.',
    curriculum: ['Neural Networks & Deep Learning', 'Cloud Computing & Microservices', 'Data Structures & Algorithms', 'AI Ethics & Autonomous Robotics'],
    career: ['AI Research Engineer', 'Machine Learning Architect', 'Full Stack Software Engineer'],
    fee: '$18,000 / Year'
  },
  {
    id: 'robotics',
    title: 'B.Tech Robotics & Autonomous Systems',
    category: 'eng',
    duration: '4 Years',
    degree: 'Undergraduate',
    placement: '97% Placement',
    icon: 'fa-solid fa-robot',
    desc: 'Design physical intelligent systems, industrial automation rovers, kinematic sensors, and embedded IoT chips.',
    curriculum: ['Embedded Systems & Microcontrollers', 'Kinematics & Dynamics', 'Computer Vision for Drones', 'Industrial Automation'],
    career: ['Robotics Hardware Engineer', 'Automation Lead', 'Control Systems Specialist'],
    fee: '$17,500 / Year'
  },
  {
    id: 'ds-cyber',
    title: 'M.S. Data Science & Cyber Security',
    category: 'ds',
    duration: '2 Years',
    degree: 'Postgraduate',
    placement: '98% Placement',
    icon: 'fa-solid fa-shield-cat',
    desc: 'Advanced threat intelligence, ethical hacking, cryptographic algorithms, and large-scale data analytics.',
    curriculum: ['Ethical Hacking & Penetration Testing', 'Applied Cryptography', 'Big Data Analytics with Apache Spark', 'Cloud Cyber Defense'],
    career: ['Cyber Security Analyst', 'Chief Information Security Officer', 'Data Architect'],
    fee: '$19,500 / Year'
  },
  {
    id: 'fintech',
    title: 'B.B.A Digital Business & FinTech',
    category: 'business',
    duration: '3 Years',
    degree: 'Undergraduate',
    placement: '95% Placement',
    icon: 'fa-solid fa-chart-line',
    desc: 'Merge strategic business management with blockchain financial technology, algorithmic trading, and startup scaling.',
    curriculum: ['Blockchain & Decentralized Finance', 'Algorithmic Trading', 'Corporate Finance', 'Digital Marketing & Growth Hacking'],
    career: ['FinTech Analyst', 'Financial Consultant', 'Tech Product Manager'],
    fee: '$15,000 / Year'
  },
  {
    id: 'quantum',
    title: 'M.S. Quantum Computing & Physics',
    category: 'cs',
    duration: '2 Years',
    degree: 'Postgraduate',
    placement: '96% Placement',
    icon: 'fa-solid fa-atom',
    desc: 'Explore quantum algorithms, Qiskit programming, superconductor qubits, and high-energy physics applications.',
    curriculum: ['Quantum Mechanics & Optics', 'Qiskit & Quantum Algorithms', 'Solid State Physics', 'Quantum Machine Learning'],
    career: ['Quantum Algorithm Researcher', 'Nanotech Specialist', 'Research Scientist'],
    fee: '$20,000 / Year'
  },
  {
    id: 'biotech',
    title: 'B.Tech Biotechnology & Genetic Engineering',
    category: 'eng',
    duration: '4 Years',
    degree: 'Undergraduate',
    placement: '94% Placement',
    icon: 'fa-solid fa-dna',
    desc: 'Pioneer CRISPR gene editing, computational biology, bio-pharmaceuticals, and sustainable green energy.',
    curriculum: ['Gene Therapy & CRISPR Technology', 'Bioinformatics & Computational Biology', 'Microbiology', 'Biochemical Reaction Engineering'],
    career: ['Bio-Tech Researcher', 'Geneticist', 'Pharma R&D Analyst'],
    fee: '$16,800 / Year'
  }
];

function initProgramExplorer() {
  const grid = document.getElementById('programs-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  renderPrograms('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderPrograms(category);
    });
  });

  // Modal Setup
  const modal = document.getElementById('program-modal');
  const closeBtn = document.getElementById('close-program-modal');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

function renderPrograms(category) {
  const grid = document.getElementById('programs-grid');
  if (!grid) return;

  const filtered = category === 'all' 
    ? PROGRAM_DATA 
    : PROGRAM_DATA.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => `
    <div class="program-card">
      <div>
        <div class="program-header">
          <div class="program-icon"><i class="${p.icon}"></i></div>
          <span class="badge badge-primary">${p.placement}</span>
        </div>
        <h3 class="program-title">${p.title}</h3>
        <p class="program-desc">${p.desc}</p>
      </div>

      <div>
        <div class="program-meta">
          <span><i class="fa-regular fa-clock"></i> ${p.duration}</span>
          <span><i class="fa-solid fa-graduation-cap"></i> ${p.degree}</span>
        </div>
        <button class="btn btn-secondary" style="width: 100%;" onclick="openProgramModal('${p.id}')">
          View Detailed Curriculum <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `).join('');
}

window.openProgramModal = function(id) {
  const program = PROGRAM_DATA.find(p => p.id === id);
  if (!program) return;

  const modal = document.getElementById('program-modal');
  const title = document.getElementById('modal-program-title');
  const body = document.getElementById('modal-program-body');

  title.innerText = program.title;
  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <span class="badge badge-accent" style="margin-right: 0.5rem;">${program.degree}</span>
      <span class="badge badge-primary">${program.duration}</span>
      <span style="float: right; font-weight: 800; color: var(--primary);">${program.fee}</span>
    </div>

    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${program.desc}</p>

    <h4 style="margin-bottom: 0.75rem;"><i class="fa-solid fa-book"></i> Core Curriculum Modules</h4>
    <ul style="margin-bottom: 1.5rem; padding-left: 1.25rem; list-style-type: disc; color: var(--text-muted);">
      ${program.curriculum.map(c => `<li style="margin-bottom: 0.4rem;">${c}</li>`).join('')}
    </ul>

    <h4 style="margin-bottom: 0.75rem;"><i class="fa-solid fa-briefcase"></i> Career Paths</h4>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
      ${program.career.map(c => `<span class="badge badge-warning">${c}</span>`).join('')}
    </div>

    <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="closeModalAndApply('${program.title}')">
      Apply For This Degree <i class="fa-solid fa-paper-plane"></i>
    </button>
  `;

  modal.classList.add('active');
};

window.closeModalAndApply = function(programTitle) {
  document.getElementById('program-modal').classList.remove('active');
  const wizardModal = document.getElementById('wizard-modal');
  if (wizardModal) {
    const select = document.getElementById('wiz-program-choice');
    if (select) {
      select.value = programTitle;
    }
    wizardModal.classList.add('active');
  }
};

/* --------------------------------------------------------------------------
   4. Tuition & Aid Calculator Engine
   -------------------------------------------------------------------------- */
function initTuitionCalculator() {
  const degreeSelect = document.getElementById('degree-select');
  const residencySelect = document.getElementById('residency-select');
  const housingSelect = document.getElementById('housing-select');
  const aidSlider = document.getElementById('aid-slider');
  const aidDisplay = document.getElementById('aid-percentage-display');

  const basePriceEl = document.getElementById('calc-base-tuition');
  const housingFeeEl = document.getElementById('calc-housing-fee');
  const savingsEl = document.getElementById('calc-savings');
  const totalPriceEl = document.getElementById('calc-total-price');

  if (!degreeSelect) return;

  function calculate() {
    let baseTuition = 18000;
    if (degreeSelect.value === 'postgrad') baseTuition = 21000;
    if (degreeSelect.value === 'doctorate') baseTuition = 24000;

    if (residencySelect.value === 'out-state') baseTuition *= 1.2;
    if (residencySelect.value === 'international') baseTuition *= 1.45;

    let housingFee = 4000;
    if (housingSelect.value === 'standard-hostel') housingFee = 2500;
    if (housingSelect.value === 'day-scholar') housingFee = 0;

    const labFee = 1200;
    const scholarshipPercent = parseInt(aidSlider.value);
    
    if (aidDisplay) {
      aidDisplay.innerText = `${scholarshipPercent}% Merit Grant`;
    }

    const savings = Math.round(baseTuition * (scholarshipPercent / 100));
    const total = Math.round((baseTuition + housingFee + labFee) - savings);

    if (basePriceEl) basePriceEl.innerText = `$${Math.round(baseTuition).toLocaleString()}`;
    if (housingFeeEl) housingFeeEl.innerText = `$${housingFee.toLocaleString()}`;
    if (savingsEl) savingsEl.innerText = `-$${savings.toLocaleString()}`;
    if (totalPriceEl) totalPriceEl.innerText = `$${total.toLocaleString()}`;
  }

  degreeSelect.addEventListener('change', calculate);
  residencySelect.addEventListener('change', calculate);
  housingSelect.addEventListener('change', calculate);
  aidSlider.addEventListener('input', calculate);

  calculate();

  const applyBtn = document.getElementById('calc-apply-aid-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      showToast('Merit Aid preference saved. Proceeding to Application Wizard!', 'success');
      document.getElementById('wizard-modal').classList.add('active');
    });
  }
}

/* --------------------------------------------------------------------------
   5. Virtual Campus Life Tabs
   -------------------------------------------------------------------------- */
function initCampusTabs() {
  const tabBtns = document.querySelectorAll('.campus-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.getAttribute('data-tab')}`;
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });

  // Tour Triggers
  ['tour-library-btn', 'tour-labs-btn', 'tour-quad-btn', 'hero-virtual-tour-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        showToast('Interactive 360° VR View Loaded! Click and drag inside view.', 'info');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. Multi-Step Admission Wizard Modal
   -------------------------------------------------------------------------- */
function initAdmissionWizard() {
  const wizardModal = document.getElementById('wizard-modal');
  const launchBtn = document.getElementById('launch-wizard-btn');
  const navApplyBtn = document.getElementById('nav-apply-btn');
  const closeBtn = document.getElementById('close-wizard-modal');

  const prevBtn = document.getElementById('wiz-prev-btn');
  const nextBtn = document.getElementById('wiz-next-btn');

  let currentStep = 1;
  const maxSteps = 4;

  if (launchBtn) launchBtn.addEventListener('click', () => wizardModal.classList.add('active'));
  if (navApplyBtn) navApplyBtn.addEventListener('click', () => wizardModal.classList.add('active'));
  if (closeBtn) closeBtn.addEventListener('click', () => wizardModal.classList.remove('active'));

  window.addEventListener('click', (e) => {
    if (e.target === wizardModal) wizardModal.classList.remove('active');
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;

      if (currentStep < maxSteps) {
        currentStep++;
        updateWizardUI();
      } else {
        // Final Submit
        wizardModal.classList.remove('active');
        showToast('Application Submitted Successfully! Admission Reference ID: #AIST-2026-9481', 'success');
        currentStep = 1;
        updateWizardUI();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  function validateStep(step) {
    if (step === 1) {
      const name = document.getElementById('wiz-name').value.trim();
      const email = document.getElementById('wiz-email').value.trim();
      if (!name || !email) {
        showToast('Please enter your full name and valid email address.', 'info');
        return false;
      }
    }
    return true;
  }

  function updateWizardUI() {
    // Update step pages
    for (let i = 1; i <= maxSteps; i++) {
      const page = document.getElementById(`wiz-page-${i}`);
      const ind = document.getElementById(`wiz-ind-${i}`);
      if (page) page.classList.toggle('active', i === currentStep);
      if (ind) ind.classList.toggle('active', i <= currentStep);
    }

    // Update buttons
    prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (currentStep === maxSteps) {
      nextBtn.innerHTML = 'Submit Application <i class="fa-solid fa-check"></i>';
      // Populate Summary
      document.getElementById('summary-name').innerText = document.getElementById('wiz-name').value || 'Alex Mercer';
      document.getElementById('summary-email').innerText = document.getElementById('wiz-email').value || 'alex@example.com';
      document.getElementById('summary-program').innerText = document.getElementById('wiz-program-choice').value;
      document.getElementById('summary-term').innerText = document.getElementById('wiz-term').value;
    } else {
      nextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    }
  }
}

/* --------------------------------------------------------------------------
   7. Event Countdown Ticker
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  let totalSeconds = 42 * 86400 + 14 * 3600 + 28 * 60 + 59;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  setInterval(() => {
    if (totalSeconds > 0) totalSeconds--;

    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    daysEl.innerText = d < 10 ? `0${d}` : d;
    hoursEl.innerText = h < 10 ? `0${h}` : h;
    minsEl.innerText = m < 10 ? `0${m}` : m;
    secsEl.innerText = s < 10 ? `0${s}` : s;
  }, 1000);

  const rsvpBtn = document.getElementById('event-rsvp-btn');
  if (rsvpBtn) {
    rsvpBtn.addEventListener('click', () => {
      showToast('RSVP Confirmed! Calendar invite sent to your email.', 'success');
    });
  }
}

/* --------------------------------------------------------------------------
   8. Spotlight Search Overlay
   -------------------------------------------------------------------------- */
function initSpotlightSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchTrigger = document.getElementById('search-trigger-btn');
  const searchInput = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results-list');

  const SEARCH_ITEMS = [
    { title: 'B.Tech Computer Science & AI', type: 'Program', link: '#programs' },
    { title: 'B.Tech Robotics Engineering', type: 'Program', link: '#programs' },
    { title: 'M.S. Data Science & Cyber Security', type: 'Program', link: '#programs' },
    { title: 'Tuition Fee Calculator & Aid', type: 'Tool', link: '#calculator' },
    { title: 'Central Library & VR Station', type: 'Campus Facility', link: '#campus' },
    { title: 'Advanced AI & Supercomputing Lab', type: 'Campus Facility', link: '#campus' },
    { title: 'Global Innovation & AI Summit 2026', type: 'Event', link: '#events' },
    { title: 'Dr. Aris Thorne (Head of AI)', type: 'Faculty', link: '#faculty' },
    { title: 'Dr. Elena Vance (Quantum Physics)', type: 'Faculty', link: '#faculty' }
  ];

  if (searchTrigger) {
    searchTrigger.addEventListener('click', openSearch);
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });

  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    renderSearch('');
  }

  searchInput.addEventListener('input', (e) => {
    renderSearch(e.target.value);
  });

  function renderSearch(query) {
    const q = query.toLowerCase().trim();
    const matches = q === '' 
      ? SEARCH_ITEMS.slice(0, 5) 
      : SEARCH_ITEMS.filter(i => i.title.toLowerCase().includes(q) || i.type.toLowerCase().includes(q));

    if (matches.length === 0) {
      resultsList.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-muted);">No results found for "${query}"</div>`;
      return;
    }

    resultsList.innerHTML = matches.map(item => `
      <div class="search-result-item" onclick="selectSearchResult('${item.link}')">
        <span class="result-title">${item.title}</span>
        <span class="result-type">${item.type}</span>
      </div>
    `).join('');
  }

  window.selectSearchResult = function(link) {
    searchModal.classList.remove('active');
    window.location.href = link;
  };
}

/* --------------------------------------------------------------------------
   9. AI Admissions Assistant Chat Widget
   -------------------------------------------------------------------------- */
function initAiAssistant() {
  const widgetBtn = document.getElementById('chat-widget-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');

  if (!widgetBtn) return;

  widgetBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('active'));

  // Quick Chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-question');
      sendChatMessage(q);
    });
  });

  sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
      sendChatMessage(text);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput.value.trim();
      if (text) {
        sendChatMessage(text);
        chatInput.value = '';
      }
    }
  });

  function sendChatMessage(msg) {
    // Append User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerText = msg;
    chatBody.appendChild(userDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate Bot Response
    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      botDiv.innerText = getBotResponse(msg);
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
  }

  function getBotResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('deadline')) {
      return "The regular application deadline for Fall 2026 is October 15th. Early Decision applications close September 1st!";
    }
    if (m.includes('scholarship')) {
      return "AIST offers up to 75% Merit Scholarships based on High School GPA / Entrance Test percentile. Use our Tuition Calculator on the page to estimate your grant!";
    }
    if (m.includes('placement') || m.includes('package')) {
      return "Our average 2025-2026 placement package was $125,000/yr with top recruiters like Google, Apple, Microsoft, and Tesla.";
    }
    if (m.includes('hostel') || m.includes('housing')) {
      return "Yes! On-campus residential suites and hostels feature high-speed fiber Wi-Fi, 24/7 security, gym, and dining hall facilities.";
    }
    return "Thank you for reaching out! Our admissions office can also be reached directly at admissions@apex-tech.edu or +1 (800) 555-APEX.";
  }
}

/* --------------------------------------------------------------------------
   10. Form Handlers & Toast System
   -------------------------------------------------------------------------- */
function initFormHandlers() {
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent to our admissions desk.', 'success');
      contactForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed to AIST Monthly Campus Newsletter!', 'success');
      newsletterForm.reset();
    });
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : 'fa-solid fa-circle-info';

  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
   11. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        let count = 0;
        const speed = target > 1000 ? Math.ceil(target / 60) : 1;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            entry.target.innerText = count.toLocaleString();
            setTimeout(updateCount, 25);
          } else {
            entry.target.innerText = target.toLocaleString() + (target === 98 ? '%' : '+');
          }
        };
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}
