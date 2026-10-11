/**
 * JEEVAN L - DEVELOPER PORTFOLIO JAVASCRIPT CONTROLLER
 * Handles interactive features: typing animation, skills filtering, modals, copy actions, form handling, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 0. Preloader / Welcome Loading Screen
  // =========================================================================
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    const minDisplayTime = 1200; // minimum display time to enjoy welcome animation
    const startTime = Date.now();

    function hidePageLoader() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        pageLoader.classList.add('loader-hidden');
        setTimeout(() => {
          pageLoader.style.display = 'none';
          pageLoader.setAttribute('aria-hidden', 'true');
        }, 650);
      }, remaining);
    }

    if (document.readyState === 'complete') {
      hidePageLoader();
    } else {
      window.addEventListener('load', hidePageLoader);
      // Failsafe timeout in case external assets take long
      setTimeout(hidePageLoader, 2800);
    }
  }

  // =========================================================================
  // 1. Dynamic Typing Effect
  // =========================================================================
  const typedTextElement = document.getElementById('typedText');
  let roles = [
    'Computer Science Engineer',
    'Python Full Stack Developer',
    'Machine Learning & AI Enthusiast',
    'Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function typeRole() {
    if (!typedTextElement) return;

    if (!roles || roles.length === 0 || (roles.length === 1 && !roles[0])) {
      typedTextElement.textContent = '';
      setTimeout(typeRole, 600);
      return;
    }

    if (roleIndex >= roles.length) {
      roleIndex = 0;
    }

    const currentRole = roles[roleIndex] || '';
    if (!currentRole) {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 200);
      return;
    }

    if (isDeleting) {
      typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause when full word is typed
      typingSpeed = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350;
    }

    setTimeout(typeRole, typingSpeed);
  }
  typeRole();

  // =========================================================================
  // 2. Navbar Scroll Behavior & Active Section Observer
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar blur background on scroll
    if (scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Active navigation link highlighting
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 3. Mobile Drawer Navigation
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    mobileMenuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuToggle?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // =========================================================================
  // 4. Skills Category Filtering
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');
      const currentSkillCards = document.querySelectorAll('.skill-card');

      currentSkillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      });
    });
  });

  // =========================================================================
  // 5. Stats Number Counter Animation
  // =========================================================================
  const counters = document.querySelectorAll('.counter');
  let hasAnimatedStats = false;

  function animateCounters() {
    const activeCounters = document.querySelectorAll('.counter');
    activeCounters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      if (isNaN(target)) return;
      const decimals = parseInt(counter.getAttribute('data-decimal') || '0', 10);
      const duration = 1400;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
          clearInterval(timer);
        } else {
          counter.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-container');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimatedStats) {
            hasAnimatedStats = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsSection);
  }

  // =========================================================================
  // 6. Project Details Data & Modal Controller
  // =========================================================================
  const projectsData = {
    'genai-healthcare': {
      title: 'Text to Image Using Gen AI for Healthcare',
      badge: 'Generative AI & Healthcare',
      category: 'Deep Learning Pipeline',
      image: 'assets/images/project-genai-healthcare.svg',
      description: 'A text-to-image generation pipeline built to synthesize high-resolution medical imaging visualizations from structured descriptive prompts using Latent Diffusion Models (LDM).',
      highlights: [
        'Developed end-to-end text-to-image pipeline integrating CLIP-based text encoding, latent diffusion models (LDM), and denoising schedulers.',
        'Optimized model inference utilizing CUDA GPU acceleration and batch processing techniques.',
        'Engineered a modular, extensible architecture supporting efficient prompt engineering, reproducibility, and scalable healthcare synthesis.',
        'Designed with strict focus on anatomical visualization accuracy and prompt consistency.'
      ],
      techStack: ['Python', 'Stable Diffusion', 'PyTorch', 'Hugging Face Diffusers', 'CUDA GPU Acceleration'],
      role: 'Lead AI Engineer'
    },
    'ml-genetics': {
      title: 'Genetic Disorders Using Machine Learning',
      badge: 'Supervised ML Classification',
      category: 'Healthcare Analytics',
      image: 'assets/images/project-ml-genetics.svg',
      description: 'A supervised machine learning predictive system designed to analyze complex clinical and demographic patient datasets to facilitate early risk prediction of genetic disorders.',
      highlights: [
        'Implemented comprehensive data preprocessing pipelines, feature engineering, and label encoding to handle high-dimensional biological data.',
        'Trained and evaluated multiple classification algorithms utilizing cross-validation and rigorous hyperparameter tuning.',
        'Optimized critical diagnostic metrics including precision, recall, accuracy, and F1-score to maximize early detection reliability.',
        'Conducted feature importance analysis to identify key clinical predictors.'
      ],
      techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Model Evaluation', 'Hyperparameter Tuning'],
      role: 'Machine Learning Developer'
    },
    'todo-list': {
      title: 'Simple Interactive To-Do List Application',
      badge: 'Interactive Frontend',
      category: 'Web Application',
      image: 'assets/images/project-todolist.svg',
      description: 'A clean, responsive, and intuitive task management application developed with semantic HTML, modern CSS, and vanilla JavaScript DOM manipulation.',
      highlights: [
        'Built full CRUD interaction allowing users to seamlessly add, edit, mark complete, and delete tasks.',
        'Engineered responsive interface tailored for both desktop and mobile viewports.',
        'Utilized efficient event handling and state updates for smooth, instantaneous interaction.',
        'Clean, accessible UI design adhering to modern frontend best practices.'
      ],
      techStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'DOM Manipulation', 'Responsive Web Design'],
      role: 'Frontend Developer'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectBody = document.getElementById('modalProjectBody');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const closeProjectFooterBtn = document.getElementById('closeProjectFooterBtn');
  const viewProjectBtns = document.querySelectorAll('.view-project-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal || !modalProjectBody || !modalProjectTitle) return;

    modalProjectTitle.textContent = data.title;

    modalProjectBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 230px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" />
      </div>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
        <span class="project-badge-highlight">${data.badge}</span>
        <span class="tag">${data.category}</span>
        <span class="tag" style="color: var(--accent-primary);"><i class="fa-solid fa-code"></i> ${data.role}</span>
      </div>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.94rem;">${data.description}</p>
      
      <h4 style="font-family: var(--font-heading); font-size: 0.98rem; color: var(--text-primary); margin-bottom: 0.65rem;">Key Engineering Highlights:</h4>
      <ul style="display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.35rem;">
        ${data.highlights.map(item => `<li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; gap: 0.55rem; line-height: 1.45;"><i class="fa-solid fa-circle-check text-blue" style="margin-top: 0.2rem; font-size: 0.85rem;"></i> <span>${item}</span></li>`).join('')}
      </ul>

      <h4 style="font-family: var(--font-heading); font-size: 0.98rem; color: var(--text-primary); margin-bottom: 0.65rem;">Tools & Technologies:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
        ${data.techStack.map(tech => `<span class="tag" style="background: rgba(96, 165, 250, 0.12); color: var(--accent-primary); border-color: rgba(96, 165, 250, 0.25); font-weight: 600;">${tech}</span>`).join('')}
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal?.classList.remove('active');
    projectModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-project-btn');
    if (btn) {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      if (projectId) openProjectModal(projectId);
    }
  });

  closeProjectModalBtn?.addEventListener('click', closeProjectModal);
  closeProjectFooterBtn?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // =========================================================================
  // 7. Resume Modal Controller
  // =========================================================================
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalBtn = document.getElementById('resumeModalBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const closeResumeFooterBtn = document.getElementById('closeResumeFooterBtn');
  const openResumeTriggers = document.querySelectorAll('.open-resume-trigger');

  function openResumeModal() {
    resumeModal?.classList.add('active');
    resumeModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    resumeModal?.classList.remove('active');
    resumeModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  resumeModalBtn?.addEventListener('click', openResumeModal);
  openResumeTriggers.forEach(btn => btn.addEventListener('click', openResumeModal));
  closeResumeModalBtn?.addEventListener('click', closeResumeModal);
  closeResumeFooterBtn?.addEventListener('click', closeResumeModal);
  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResumeModal();
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
      closeDrawer();
    }
  });

  // =========================================================================
  // 8. Toast Notifications & Copy to Clipboard
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  function showToast(message, isSuccess = true) {
    if (!toast || !toastMessage) return;

    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    
    const icon = toast.querySelector('.toast-icon');
    if (icon) {
      icon.className = isSuccess 
        ? 'fa-solid fa-circle-check toast-icon text-blue' 
        : 'fa-solid fa-triangle-exclamation toast-icon text-amber';
    }

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Copy Buttons handler
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        // Fallback for older browsers or restricted clipboard permissions
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }
    });
  });

  // =========================================================================
  // 9. Contact Form Handler (Direct Backend Storage + Mailto Fallback)
  // =========================================================================
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const subject = document.getElementById('msgSubject')?.value.trim();
      const message = document.getElementById('userMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', false);
        return;
      }

      // Try sending directly to backend API
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        if (res.ok) {
          showToast('✓ Message sent and stored in Admin Inbox!');
          contactForm.reset();
          return;
        }
      } catch (err) {
        // Fall through to mailto fallback if backend offline
      }

      // Format mailto link targeting Jeevan's verified email
      const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
      const encodedBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:jeevannlokesh96@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      window.location.href = mailtoUrl;
      showToast('Opening your default email client to send message...');
      contactForm.reset();
    });
  }

  // =========================================================================
  // 10. Live Backend Data Sync (Loads edits made from Admin Portal)
  // =========================================================================
  async function syncBackendData() {
    try {
      let data = null;

      // 1. Live Node.js backend API (when running node server.js)
      try {
        const res = await fetch('/api/portfolio?_t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await res.json();
            try { localStorage.setItem('portfolioData', JSON.stringify(data)); } catch (e) {}
          }
        }
      } catch (e) {
        // Backend server offline (e.g. static hosting)
      }

      // 2. If server API not responding, fetch static data/portfolio.json file
      let fileData = null;
      if (!data) {
        try {
          const res = await fetch('data/portfolio.json?_t=' + Date.now(), { cache: 'no-store' });
          if (res.ok) {
            fileData = await res.json();
          }
        } catch (e) {}
      }

      // 3. Check browser localStorage
      let cachedData = null;
      if (!data) {
        try {
          const cached = localStorage.getItem('portfolioData');
          if (cached) cachedData = JSON.parse(cached);
        } catch (e) {}
      }

      // 4. Resolve data source when server API is not active:
      if (!data) {
        if (cachedData && fileData) {
          const cachedTime = Number(cachedData._lastModified) || 0;
          const fileTime = Number(fileData._lastModified) || 0;
          // Prefer cachedData ONLY if it has an explicitly newer timestamp from a recent Admin save
          if (cachedTime > fileTime && cachedTime > 0) {
            data = cachedData;
          } else {
            // Fresh file on disk or server is the authoritative source
            data = fileData;
            try { localStorage.setItem('portfolioData', JSON.stringify(fileData)); } catch (e) {}
          }
        } else {
          data = fileData || cachedData;
        }
      }

      if (!data) return;

      // -----------------------------------------------------------------------
      // Helper: Synchronize or blank out Quick Details rows in About section
      // -----------------------------------------------------------------------
      function syncDetailRow(iconClass, value, isLink, linkPrefix) {
        const iconEl = document.querySelector(`#about .details-list .${iconClass}`);
        if (!iconEl) return;
        const row = iconEl.closest('.detail-row');
        if (!row) return;
        const valEl = row.querySelector('.detail-value');
        const hasVal = Boolean(value && String(value).trim());
        if (hasVal) {
          row.style.display = '';
          if (valEl) {
            valEl.textContent = value;
            if (isLink && linkPrefix) {
              valEl.href = `${linkPrefix}${value}`;
            }
          }
        } else {
          row.style.display = 'none';
          if (valEl) {
            valEl.textContent = '';
            if (isLink) valEl.href = '#';
          }
        }
      }

      // -----------------------------------------------------------------------
      // 1. Profile & Hero Synchronization
      // -----------------------------------------------------------------------
      if (data.profile) {
        const p = data.profile;

        // Name
        const titleEl = document.querySelector('.hero-title .gradient-text') || document.querySelector('.hero-title span:last-child');
        if (titleEl) {
          titleEl.textContent = p.name ? p.name.toUpperCase() : '';
        }
        const logoName = document.querySelector('.logo-name');
        if (logoName && p.name) {
          logoName.textContent = p.name.split(' ')[0] || p.name;
        }
        if (p.name) {
          document.title = `${p.name} | Developer Portfolio`;
        }

        // Avatar
        const heroImg = document.getElementById('heroProfileImg');
        if (heroImg) {
          if (p.avatar && p.avatar.trim()) {
            heroImg.src = p.avatar;
            heroImg.style.display = '';
          } else {
            heroImg.src = '';
            heroImg.style.display = 'none';
          }
        }

        // Status pill
        const statusPill = document.querySelector('.status-pill');
        const statusText = document.querySelector('.status-text');
        if (statusText) statusText.textContent = p.status || '';
        if (statusPill) {
          statusPill.style.display = (p.status && p.status.trim()) ? 'inline-flex' : 'none';
        }

        // Dynamic typing roles
        const typingWrapper = document.querySelector('.hero-typing-wrapper');
        const typedTextEl = document.getElementById('typedText');
        if (Array.isArray(p.roles)) {
          const filteredRoles = p.roles.filter(r => r && r.trim());
          if (filteredRoles.length > 0) {
            roles = filteredRoles;
            if (typingWrapper) typingWrapper.style.display = '';
          } else {
            roles = [''];
            if (typedTextEl) typedTextEl.textContent = '';
            if (typingWrapper) typingWrapper.style.display = 'none';
          }
          roleIndex = 0;
          charIndex = 0;
          isDeleting = false;
        }

        // Hero Summary Description
        const summaryEl = document.querySelector('.hero-description');
        if (summaryEl) {
          const hasSummary = Boolean(p.heroSummary && p.heroSummary.trim());
          summaryEl.innerHTML = hasSummary ? p.heroSummary : '';
          summaryEl.style.display = hasSummary ? '' : 'none';
        }

        // Academic CGPA & Badges
        const hasCgpa = Boolean(p.cgpa && String(p.cgpa).trim());
        const cgpaBadge = document.querySelector('.badge-cgpa');
        if (cgpaBadge) cgpaBadge.textContent = hasCgpa ? `${p.cgpa} / 10.0` : '';
        const miniCard = document.querySelector('.hero-mini-card');
        const miniCardCgpa = document.querySelector('.hero-mini-card strong');
        if (miniCardCgpa) miniCardCgpa.textContent = hasCgpa ? `${p.cgpa} / 10` : '';
        if (miniCard) miniCard.style.display = hasCgpa ? '' : 'none';

        // About Quick Details List
        syncDetailRow('fa-user', p.name);
        syncDetailRow('fa-graduation-cap', p.degree);
        syncDetailRow('fa-building-columns', p.college);
        syncDetailRow('fa-chart-line', p.cgpa ? `${p.cgpa} / 10.0` : '');
        syncDetailRow('fa-envelope', p.email, true, 'mailto:');
        syncDetailRow('fa-phone', p.phone, true, 'tel:');
        syncDetailRow('fa-location-dot', p.location);

        // General Email & Phone Copy / Href bindings
        const hasEmail = Boolean(p.email && p.email.trim());
        document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
          if (hasEmail) {
            a.href = `mailto:${p.email}`;
            a.style.display = '';
          } else {
            a.href = '#';
            a.style.display = 'none';
          }
        });
        document.querySelectorAll('.copy-btn[data-copy*="@"]').forEach(b => {
          b.setAttribute('data-copy', p.email || '');
          b.style.display = hasEmail ? '' : 'none';
        });

        const hasPhone = Boolean(p.phone && p.phone.trim());
        const cleanPhone = hasPhone ? p.phone.replace(/[^0-9+]/g, '') : '';
        document.querySelectorAll('a[href^="tel:"]').forEach(a => {
          if (hasPhone) {
            a.href = `tel:${cleanPhone}`;
            a.style.display = '';
          } else {
            a.href = '#';
            a.style.display = 'none';
          }
        });
        document.querySelectorAll('.copy-btn[data-copy*="+"]').forEach(b => {
          b.setAttribute('data-copy', p.phone || '');
          b.style.display = hasPhone ? '' : 'none';
        });

        // Resume Links & Modals
        const hasResume = Boolean(p.resumeUrl && p.resumeUrl.trim());
        const resumeLinks = document.querySelectorAll('a[href*="Resume.pdf"], a[href*="resume.pdf"], a[download*="Resume.pdf"], a[download*="resume.pdf"]');
        resumeLinks.forEach(link => {
          if (hasResume) {
            link.href = p.resumeUrl;
            link.style.display = '';
            if (link.hasAttribute('download')) {
              link.setAttribute('download', p.resumeFileName || 'Jeevan_L_Resume.pdf');
            }
          } else {
            link.style.display = 'none';
          }
        });

        const resumeTriggers = document.querySelectorAll('.open-resume-trigger');
        resumeTriggers.forEach(btn => {
          btn.style.display = hasResume ? '' : 'none';
        });
        const resumeModalBtn = document.getElementById('resumeModalBtn');
        if (resumeModalBtn) resumeModalBtn.style.display = hasResume ? '' : 'none';

        const resumeIframe = document.querySelector('.resume-iframe');
        if (resumeIframe) {
          resumeIframe.src = hasResume ? p.resumeUrl : '';
        }

        // Social Platforms Configuration
        const socialPlatforms = [
          { key: 'linkedin', label: 'LinkedIn Profile', icon: 'fa-brands fa-linkedin-in', iconClass: 'linkedin-icon', url: p.linkedin, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'github', label: 'GitHub Profile', icon: 'fa-brands fa-github', iconClass: 'github-icon', url: p.github, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'leetcode', label: 'LeetCode', icon: 'fa-solid fa-code', iconClass: 'leetcode-icon', url: p.leetcode, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'twitter', label: 'Twitter / X', icon: 'fa-brands fa-x-twitter', iconClass: 'twitter-icon', url: p.twitter, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'reddit', label: 'Reddit', icon: 'fa-brands fa-reddit', iconClass: 'reddit-icon', url: p.reddit, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram', iconClass: 'instagram-icon', url: p.instagram, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'discord', label: 'Discord', icon: 'fa-brands fa-discord', iconClass: 'discord-icon', url: p.discord, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' },
          { key: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube', iconClass: 'youtube-icon', url: p.youtube, display: (u) => u ? u.replace(/^https?:\/\/(www\.)?/, '') : '' }
        ];
        const activeSocials = socialPlatforms.filter(item => item.url && item.url.trim());

        // Sync Contact Info Column Cards
        const contactInfoCol = document.getElementById('contactInfoCol');
        if (contactInfoCol) {
          const emailCardHtml = hasEmail ? `
            <div class="contact-method-card glass-panel">
              <div class="method-icon email-icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="method-details">
                <span class="method-label">Direct Email</span>
                <a href="mailto:${p.email}" class="method-value">${p.email}</a>
              </div>
              <button class="copy-btn" data-copy="${p.email}" title="Copy Email to Clipboard" aria-label="Copy Email">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>` : '';

          const phoneCardHtml = hasPhone ? `
            <div class="contact-method-card glass-panel">
              <div class="method-icon phone-icon"><i class="fa-solid fa-phone"></i></div>
              <div class="method-details">
                <span class="method-label">Phone</span>
                <a href="tel:${cleanPhone}" class="method-value">${p.phone}</a>
              </div>
              <button class="copy-btn" data-copy="${p.phone}" title="Copy Phone to Clipboard" aria-label="Copy Phone">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>` : '';

          const socialCardsHtml = activeSocials.map(item => `
            <div class="contact-method-card glass-panel">
              <div class="method-icon ${item.iconClass}"><i class="${item.icon}"></i></div>
              <div class="method-details">
                <span class="method-label">${item.label}</span>
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="method-value">${item.display(item.url)}</a>
              </div>
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="external-link-btn" aria-label="Open ${item.label}">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          `).join('');

          const allCards = emailCardHtml + phoneCardHtml + socialCardsHtml;
          contactInfoCol.innerHTML = allCards || `
            <div class="empty-state" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
              <i class="fa-solid fa-address-book" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
              <p style="font-size: 1rem;">No contact channels specified.</p>
            </div>`;
        }

        // Sync Hero Social Strip Icons
        const heroSocialIcons = document.getElementById('heroSocialIcons');
        const heroSocialStrip = document.querySelector('.hero-social-strip');
        if (heroSocialIcons) {
          const heroSocialsHtml = activeSocials.map(item => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="social-btn" title="${item.label}" aria-label="${item.label}">
              <i class="${item.icon}"></i>
            </a>
          `).join('') +
          (hasEmail ? `<a href="mailto:${p.email}" class="social-btn" title="Send Email" aria-label="Send Email"><i class="fa-solid fa-envelope"></i></a>` : '') +
          (hasPhone ? `<a href="tel:${cleanPhone}" class="social-btn" title="Call Me" aria-label="Call Me"><i class="fa-solid fa-phone"></i></a>` : '');

          heroSocialIcons.innerHTML = heroSocialsHtml;
          if (heroSocialStrip) {
            heroSocialStrip.style.display = heroSocialsHtml ? '' : 'none';
          }
        }

        // Sync Drawer Socials
        const drawerSocials = document.getElementById('drawerSocials');
        if (drawerSocials) {
          drawerSocials.innerHTML = activeSocials.map(item => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}"><i class="${item.icon}"></i></a>
          `).join('') +
          (hasEmail ? `<a href="mailto:${p.email}" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>` : '') +
          (hasPhone ? `<a href="tel:${cleanPhone}" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>` : '');
        }

        // Sync Footer Socials
        const footerSocials = document.getElementById('footerSocials');
        if (footerSocials) {
          footerSocials.innerHTML = activeSocials.map(item => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}"><i class="${item.icon}"></i></a>
          `).join('') +
          (hasEmail ? `<a href="mailto:${p.email}" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>` : '') +
          (hasPhone ? `<a href="tel:${cleanPhone}" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>` : '');
        }
      }

      // -----------------------------------------------------------------------
      // 2. About Me Section Synchronization
      // -----------------------------------------------------------------------
      if (data.about) {
        if (data.about.heading !== undefined) {
          const headingEl = document.getElementById('aboutHeading');
          if (headingEl) {
            headingEl.innerHTML = data.about.heading && data.about.heading.trim() 
              ? `<i class="fa-solid fa-code text-blue"></i> ${data.about.heading}` 
              : '';
            headingEl.style.display = data.about.heading && data.about.heading.trim() ? '' : 'none';
          }
        }

        if (Array.isArray(data.about.bioParagraphs)) {
          const bioContainer = document.getElementById('aboutBioContainer');
          if (bioContainer) {
            const validTexts = data.about.bioParagraphs.filter(t => t && t.trim());
            bioContainer.innerHTML = validTexts.map(text => `<p class="about-text">${text}</p>`).join('');
          }
        }

        if (Array.isArray(data.about.pillars)) {
          const pillarsContainer = document.getElementById('aboutPillarsGrid');
          if (pillarsContainer) {
            if (data.about.pillars.length === 0) {
              pillarsContainer.innerHTML = '';
              pillarsContainer.style.display = 'none';
            } else {
              pillarsContainer.style.display = '';
              pillarsContainer.innerHTML = data.about.pillars.map(pil => `
                <div class="pillar-item">
                  <div class="pillar-icon"><i class="${pil.icon || 'fa-solid fa-code'}"></i></div>
                  <div>
                    <h4>${pil.title || ''}</h4>
                    <p>${pil.desc || ''}</p>
                  </div>
                </div>
              `).join('');
            }
          }
        }

        if (Array.isArray(data.about.stats)) {
          const statsGrid = document.getElementById('statsGrid');
          const statsContainer = document.querySelector('.stats-container');
          if (statsGrid) {
            if (data.about.stats.length === 0) {
              statsGrid.innerHTML = '';
              if (statsContainer) statsContainer.style.display = 'none';
            } else {
              if (statsContainer) statsContainer.style.display = '';
              statsGrid.innerHTML = data.about.stats.map(st => `
                <div class="stat-card">
                  <div class="stat-number">
                    <span class="counter" data-target="${st.value || 0}" ${st.decimal ? `data-decimal="${st.decimal}"` : ''}>${st.value || 0}</span>
                    ${st.suffix ? `<span class="stat-suffix">${st.suffix}</span>` : ''}
                  </div>
                  <div class="stat-label">${st.label || ''}</div>
                </div>
              `).join('');
              if (typeof animateCounters === 'function') animateCounters();
            }
          }
        }
      }

      // -----------------------------------------------------------------------
      // 3. Projects Section & Modal Sync
      // -----------------------------------------------------------------------
      if (Array.isArray(data.projects)) {
        // Clear previous project modal map before repopulating
        for (const key in projectsData) {
          delete projectsData[key];
        }

        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
          if (data.projects.length === 0) {
            projectsGrid.innerHTML = `
              <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                <p style="font-size: 1rem;">No projects listed.</p>
              </div>`;
          } else {
            data.projects.forEach(p => {
              projectsData[p.id] = {
                title: p.title || '',
                badge: p.badge || p.category || '',
                category: p.category || 'Engineering Project',
                image: p.image || 'assets/images/project-todolist.svg',
                description: p.description || '',
                highlights: p.bullets || [],
                techStack: p.tags || [],
                role: 'Developer',
                github: p.github || '',
                demo: p.demo || ''
              };
            });

            projectsGrid.innerHTML = data.projects.map(p => `
              <article class="project-card glass-panel">
                <div class="card-glow"></div>
                <div class="project-image-wrapper">
                  <img src="${p.image || 'assets/images/project-todolist.svg'}" alt="${p.title || 'Project'}" class="project-img" loading="lazy" />
                  <div class="project-overlay">
                    <button class="btn btn-primary btn-sm view-project-btn" data-project="${p.id}">
                      <i class="fa-solid fa-eye"></i> Quick View Details
                    </button>
                  </div>
                  <div class="project-category-badge">${p.category || 'Project'}</div>
                </div>

                <div class="project-content">
                  <div class="project-header-row">
                    <h3 class="project-title">${p.title || ''}</h3>
                    <span class="project-badge-highlight">${p.badge || p.category || 'Project'}</span>
                  </div>
                  <p class="project-description">${p.description || ''}</p>
                  
                  ${p.bullets && p.bullets.length ? `
                  <ul class="project-bullets">
                    ${p.bullets.map(b => `<li><i class="fa-solid fa-check text-cyan"></i> ${b}</li>`).join('')}
                  </ul>` : ''}

                  <div class="project-tech-tags">
                    ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                  </div>

                  <div class="project-links">
                    <button class="btn btn-outline btn-sm view-project-btn" data-project="${p.id}">
                      <i class="fa-solid fa-circle-info"></i> Project Details
                    </button>
                    ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa-brands fa-github"></i> GitHub Code</a>` : `<a href="#contact" class="btn btn-primary btn-sm"><i class="fa-solid fa-envelope"></i> Inquire Code</a>`}
                    ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
                  </div>
                </div>
              </article>
            `).join('');
          }
        }
      }

      // -----------------------------------------------------------------------
      // 4. Technical Skills Section
      // -----------------------------------------------------------------------
      if (Array.isArray(data.skills)) {
        const skillsGrid = document.getElementById('skillsGrid');
        if (skillsGrid) {
          if (data.skills.length === 0) {
            skillsGrid.innerHTML = `
              <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fa-solid fa-layer-group" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                <p style="font-size: 1rem;">No technical skills listed.</p>
              </div>`;
          } else {
            skillsGrid.innerHTML = data.skills.map(s => `
              <div class="skill-card glass-panel" data-category="${s.category || 'tools'}">
                <div class="skill-icon-wrapper">
                  <i class="${s.icon || 'fa-solid fa-code'}"></i>
                </div>
                <div class="skill-info">
                  <div class="skill-name-row">
                    <span class="skill-name">${s.name || ''}</span>
                    <span class="skill-level-badge core">${s.level || ''}</span>
                  </div>
                  <p class="skill-desc">${s.desc || ''}</p>
                </div>
              </div>
            `).join('');
          }
        }
      }

      // -----------------------------------------------------------------------
      // 5. Experience Section
      // -----------------------------------------------------------------------
      if (Array.isArray(data.experience)) {
        const expTimeline = document.getElementById('experienceTimeline');
        if (expTimeline) {
          if (data.experience.length === 0) {
            expTimeline.innerHTML = `
              <div class="empty-state" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fa-solid fa-briefcase" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                <p style="font-size: 1rem;">No experience entries listed.</p>
              </div>`;
          } else {
            expTimeline.innerHTML = data.experience.map(e => `
              <div class="timeline-item">
                <div class="timeline-marker">
                  <i class="${e.icon || 'fa-solid fa-briefcase'}"></i>
                </div>
                <div class="timeline-content glass-panel">
                  <span class="timeline-date">${e.date || ''}</span>
                  <div class="timeline-badge-pill">${e.pill || 'Experience'}</div>
                  <h3 class="timeline-title">${e.title || ''}</h3>
                  <h4 class="timeline-org"><i class="fa-solid fa-building"></i> ${e.org || ''}</h4>
                  <p class="timeline-text">${e.text || ''}</p>
                  ${e.tags && e.tags.length ? `
                  <div class="timeline-tags">
                    ${e.tags.map(t => `<span>${t}</span>`).join('')}
                  </div>` : ''}
                </div>
              </div>
            `).join('');
          }
        }
      }

      // -----------------------------------------------------------------------
      // 6. Certifications Section
      // -----------------------------------------------------------------------
      if (Array.isArray(data.certifications)) {
        const certGrid = document.getElementById('certGrid');
        if (certGrid) {
          if (data.certifications.length === 0) {
            certGrid.innerHTML = `
              <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fa-solid fa-award" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                <p style="font-size: 1rem;">No certifications listed.</p>
              </div>`;
          } else {
            certGrid.innerHTML = data.certifications.map(c => `
              <div class="cert-card glass-panel">
                <div class="cert-icon-box ${c.badgeClass || 'deloitte-bg'}">
                  <i class="${c.icon || 'fa-solid fa-award'}"></i>
                </div>
                <div class="cert-body">
                  <div class="cert-issuer">${c.issuer || ''}</div>
                  <h3 class="cert-name">${c.name || ''}</h3>
                  <p class="cert-desc">${c.desc || ''}</p>
                  <span class="cert-status"><i class="fa-solid fa-shield-check"></i> ${c.status || ''}</span>
                  ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:0.5rem; font-size:0.82rem; color:var(--accent-primary);"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Credential</a>` : ''}
                </div>
              </div>
            `).join('');
          }
        }
      }

      // -----------------------------------------------------------------------
      // 7. Education Section
      // -----------------------------------------------------------------------
      if (Array.isArray(data.education)) {
        const eduWrapper = document.getElementById('eduCardWrapper');
        if (eduWrapper) {
          if (data.education.length === 0) {
            eduWrapper.innerHTML = `
              <div class="empty-state" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fa-solid fa-graduation-cap" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
                <p style="font-size: 1rem;">No education entries listed.</p>
              </div>`;
          } else {
            eduWrapper.innerHTML = data.education.map(ed => `
              <div class="edu-card glass-panel">
                <div class="edu-header">
                  <div class="edu-icon"><i class="fa-solid fa-building-columns"></i></div>
                  <div class="edu-title-group">
                    <span class="edu-period">${ed.period || ''}</span>
                    <h3 class="edu-degree">${ed.degree || ''}</h3>
                    <h4 class="edu-institute">${ed.institute || ''}</h4>
                  </div>
                  <div class="edu-grade-badge">
                    <span class="grade-label">Cumulative CGPA</span>
                    <span class="grade-score">${ed.cgpa || ''}</span>
                  </div>
                </div>

                <div class="edu-body">
                  <p class="edu-summary">${ed.summary || ''}</p>
                  ${ed.courses && ed.courses.length ? `
                  <div class="edu-coursework">
                    <span class="course-label">Key Relevant Coursework:</span>
                    <div class="course-tags">
                      ${ed.courses.map(course => `<span>${course}</span>`).join('')}
                    </div>
                  </div>` : ''}
                </div>
              </div>
            `).join('');
          }
        }
      }

    } catch (e) {
      console.warn('Backend sync note:', e);
    }
  }

  // Initial load
  syncBackendData();

  // Listen for storage events (updates in real time from Admin Portal in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData') {
      syncBackendData();
    }
  });

  console.log('⚡ Jeevan L Developer Portfolio Loaded Successfully.');
});
