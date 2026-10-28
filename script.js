// =====================================================
// Knightのホームページ  script.js
// 3つの小さな機能だけ。全体を (() => { ... })() で包んでいるのは、
// 変数が他のスクリプトとぶつからないようにするための定番の書き方です。
// =====================================================
(() => {
  // ---------- 1. フッターの年を自動で今年にする ----------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- 2. スクロールで要素をふわっと表示する ----------
  // IntersectionObserver = 「画面に入ったか」を教えてくれるブラウザ機能
  const reveals = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    // 古いブラウザ、または「動きを減らす」設定のときは最初から全部表示
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible'); // CSSの .is-visible が効く
            observer.unobserve(entry.target);         // 一度出たら監視をやめる
          }
        });
      },
      { threshold: 0.12 } // 要素が12%見えたら発動
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  // ---------- 3. 今見ているセクションをナビで光らせる ----------
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sectionToLink = new Map(); // セクション → 対応するナビのリンク

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sectionToLink.set(section, link);
  });

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((l) => l.removeAttribute('aria-current'));
          sectionToLink.get(entry.target).setAttribute('aria-current', 'true');
        });
      },
      // 画面の中央あたり(上40%〜下55%を除いた帯)に来たセクションを「現在地」とする
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sectionToLink.forEach((_, section) => navObserver.observe(section));
  }
})();