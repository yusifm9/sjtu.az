
/* SJTU.AZ — main.js */

const I18N = {
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_events: 'Events',
    nav_join: 'Join',
    nav_booth: 'Booth',
    lang_en: 'EN',
    lang_zh: '中文'
  },
  zh: {
    nav_home: '首页',
    nav_about: '关于我们',
    nav_events: '活动',
    nav_join: '加入我们',
    nav_booth: '展位',
    lang_en: 'EN',
    lang_zh: '中文'
  }
};

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const value = el.getAttribute(lang === 'zh' ? 'data-zh' : 'data-en');
    if (value !== null) el.innerHTML = value;
  });

  document.querySelectorAll('[data-en-attr][data-zh-attr]').forEach(el => {
    const value = el.getAttribute(lang === 'zh' ? 'data-zh-attr' : 'data-en-attr');
    const attr = el.getAttribute('data-target-attr') || 'content';
    if (value !== null) el.setAttribute(attr, value);
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });

  localStorage.setItem('sjtuaz-lang', lang);
}

document.addEventListener('DOMContentLoaded', function () {
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang || 'en'));
  });

  const saved = localStorage.getItem('sjtuaz-lang');
  const startLang = saved === 'zh' ? 'zh' : 'en';
  applyLanguage(startLang);
});
