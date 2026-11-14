const $=s=>document.querySelector(s);
let lang='en';
const menu=$('#menu'),nav=$('#nav');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label',lang==='ta'?'பட்டியைத் திறக்கவும்':'Open menu')
}
menu.addEventListener('click',()=> {
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Close menu':'Open menu')
}
);
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=> {
  if(e.key==='Escape')closeMenu()
}
);
function setLanguage(value) {
  lang=value;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-en]').forEach(el=> {
    el.innerHTML=el.dataset[lang]
  }
  );
  $('#language').textContent=lang==='ta'?'English':'தமிழ்';
  $('#language').setAttribute('aria-label',lang==='ta'?'Switch to English':'Switch to Tamil');
  document.title=lang==='ta'?'ஸ்ரீ சாஸ்தா டிரைவிங் ஸ்கூல் | மதுரை':'Sri Sastha Driving School | Madurai';
  try {
    localStorage.setItem('sastha-language',lang)
  }
  catch {
  }
  closeMenu();
  updateHeroLabel()
}
$('#language').addEventListener('click',()=>setLanguage(lang==='en'?'ta':'en'));
const slides=[ {
  src:'assets/hero-01.webp',en:'01 — TEPPAKULAM, MADURAI',ta:'01 — தெப்பக்குளம், மதுரை',alt:'Learner car and helmeted scooter rider beside Madurai Teppakulam'
}
, {
  src:'assets/hero-02.webp',en:'02 — CAR DRIVING TRAINING',ta:'02 — கார் ஓட்டுநர் பயிற்சி',alt:'Illustrative car lesson with instructor'
}
, {
  src:'assets/hero-03.webp',en:'03 — TWO-WHEELER TRAINING',ta:'03 — இருசக்கர வாகனப் பயிற்சி',alt:'Illustrative helmeted scooter learner'
}
];
let current=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateHeroLabel() {
  $('#hero-label').textContent=slides[current][lang];
  $('#hero-count').textContent=String(current+1).padStart(2,'0')+' / 03';
  document.querySelectorAll('[data-slide]').forEach((b,i)=> {
    b.classList.toggle('active',i===current);
    b.setAttribute('aria-pressed',String(i===current))
  }
  )
}
// Hero: two preloaded image layers crossfade without flashing white.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.querySelector('.hero');
const heroControls = document.querySelector('.hero-controls');
const heroPrimary = document.querySelector('#hero-image');
const heroSecondary = heroPrimary.cloneNode(false);
heroSecondary.removeAttribute('id');
heroSecondary.setAttribute('aria-hidden', 'true');
heroSecondary.alt = '';
heroSecondary.classList.add('hero-secondary');
heroPrimary.after(heroSecondary);
heroPrimary.classList.add('slide-visible');
let visibleHero = heroPrimary;
let heroRequest = 0;
let heroTimer;
let heroHover = false;
const heroCache = slides.map(slide => {
  const image = new Image();
  image.src = slide.src;
  return image;
});
async function showSlide(n) {
  const next = (n + slides.length) % slides.length;
  const request = ++heroRequest;
  try { await heroCache[next].decode(); } catch (_) { /* The browser can still use the cached image. */ }
  if (request !== heroRequest) return;
  const incoming = visibleHero === heroPrimary ? heroSecondary : heroPrimary;
  incoming.src = slides[next].src;
  incoming.alt = incoming === heroPrimary ? slides[next].alt : '';
  incoming.classList.add('slide-visible');
  visibleHero.classList.remove('slide-visible');
  visibleHero = incoming;
  current = next;
  updateHeroLabel();
}
function restartHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (!paused && !heroHover && !document.hidden && !nav.classList.contains('open')) showSlide(current + 1);
  }, 5000);
}
function manualHero(n) { showSlide(n); restartHeroTimer(); }
document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => manualHero(Number(button.dataset.slide))));
$('#hero-prev').onclick = () => manualHero(current - 1);
$('#hero-next').onclick = () => manualHero(current + 1);
function pauseButton() {
  $('#hero-pause').textContent = paused ? '▶' : 'Ⅱ';
  $('#hero-pause').setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  $('#hero-pause').setAttribute('aria-pressed', String(paused));
}
$('#hero-pause').onclick = () => { paused = !paused; pauseButton(); restartHeroTimer(); };
heroControls.addEventListener('mouseenter', () => heroHover = true);
heroControls.addEventListener('mouseleave', () => heroHover = false);
heroControls.addEventListener('focusin', () => heroHover = true);
heroControls.addEventListener('focusout', event => { if (!heroControls.contains(event.relatedTarget)) heroHover = false; });
pauseButton();
restartHeroTimer();

// Trainer showcase: cloned end panels make the carousel loop continuously.
const team = document.querySelector('#team');
const track = document.querySelector('#team-track');
const frame = document.createElement('div');
frame.className = 'team-showcase';
track.before(frame);
frame.append(track);
const originals = [...track.children];
const totalTrainers = originals.length;
function cloneTrainer(card) {
  const clone = card.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.inert = true;
  return clone;
}
track.prepend(...originals.map(cloneTrainer));
track.append(...originals.map(cloneTrainer));
let trainerPosition = totalTrainers;
let trainerPaused = reducedMotion;
let trainerHover = false;
let trainerVisible = false;
let trainerTimer;
let trainerMoving = false;
const teamDots = document.querySelector('#team-dots');
originals.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', 'Show trainer ' + (index + 1));
  dot.addEventListener('click', () => { moveTrainer(totalTrainers + index); restartTrainerTimer(); });
  teamDots.append(dot);
});
function trainerIndex() { return ((trainerPosition - totalTrainers) % totalTrainers + totalTrainers) % totalTrainers; }
function paintTrainers(animate = true) {
  const cards = [...track.children];
  const card = cards[trainerPosition];
  if (!card) return;
  track.style.transition = animate && !reducedMotion ? 'transform 450ms cubic-bezier(.22,.61,.36,1)' : 'none';
  track.style.transform = `translateX(${frame.clientWidth / 2 - card.offsetLeft - card.offsetWidth / 2}px)`;
  cards.forEach((item, index) => item.classList.toggle('showcase-active', index === trainerPosition));
  [...teamDots.children].forEach((dot, index) => { dot.classList.toggle('active', index === trainerIndex()); dot.setAttribute('aria-pressed', String(index === trainerIndex())); });
}
function moveTrainer(position) {
  if (trainerMoving) return;
  trainerPosition = position;
  trainerMoving = !reducedMotion;
  paintTrainers();
}
track.addEventListener('transitionend', event => {
  if (event.target !== track || event.propertyName !== 'transform') return;
  trainerMoving = false;
  if (trainerPosition >= totalTrainers * 2 || trainerPosition < totalTrainers) {
    trainerPosition = totalTrainers + trainerIndex();
    paintTrainers(false);
  }
});
function restartTrainerTimer() {
  clearInterval(trainerTimer);
  trainerTimer = setInterval(() => {
    if (!trainerPaused && !trainerHover && trainerVisible && !document.hidden) moveTrainer(trainerPosition + 1);
  }, 1800);
}
$('#team-prev').onclick = () => { moveTrainer(trainerPosition - 1); restartTrainerTimer(); };
$('#team-next').onclick = () => { moveTrainer(trainerPosition + 1); restartTrainerTimer(); };
function trainerPauseButton() {
  $('#team-pause').textContent = trainerPaused ? '▶' : 'Ⅱ';
  $('#team-pause').setAttribute('aria-label', trainerPaused ? 'Play trainer showcase' : 'Pause trainer showcase');
  $('#team-pause').setAttribute('aria-pressed', String(trainerPaused));
}
$('#team-pause').onclick = () => { trainerPaused = !trainerPaused; trainerPauseButton(); restartTrainerTimer(); };
team.addEventListener('mouseenter', () => trainerHover = true);
team.addEventListener('mouseleave', () => trainerHover = false);
team.addEventListener('focusin', () => trainerHover = true);
team.addEventListener('focusout', event => { if (!team.contains(event.relatedTarget)) trainerHover = false; });
track.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); $('#team-next').click(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); $('#team-prev').click(); }
});
function swipe(element, previous, next) {
  let startX = 0, startY = 0;
  element.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; startY = event.changedTouches[0].clientY; }, { passive: true });
  element.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) dx > 0 ? previous() : next();
  }, { passive: true });
}
swipe(frame, () => $('#team-prev').click(), () => $('#team-next').click());
swipe(hero, () => manualHero(current - 1), () => manualHero(current + 1));
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => { trainerVisible = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(frame);
} else trainerVisible = true;
new ResizeObserver(() => { trainerMoving = false; paintTrainers(false); }).observe(frame);
paintTrainers(false);
trainerPauseButton();
restartTrainerTimer();

document.querySelectorAll('.course-enquiry').forEach(a=>a.onclick=()=> {
  $('#course').value=a.dataset.course
}
);
$('#enquiry').addEventListener('submit',e=> {
  e.preventDefault();
  const form=e.currentTarget;
  if(!form.reportValidity())return;
  const name=$('#name').value.trim(),mobile=$('#mobile').value.trim();
  if(!name) {
    $('#name').setCustomValidity(lang==='ta'?'உங்கள் பெயரை உள்ளிடவும்.':'Please enter your name.');
    $('#name').reportValidity();
    return
  }
  const course=$('#course').selectedOptions[0].textContent,time=$('#time').selectedOptions[0].textContent;
  const message=lang==='ta'?`வணக்கம் ஸ்ரீ சாஸ்தா டிரைவிங் ஸ்கூல்!\nபயிற்சி விவரம் அறிய விரும்புகிறேன்.\nபெயர்: ${name}\nகைபேசி: ${mobile}\nபயிற்சி: ${course}\nநேரம்: ${time}\nசெய்தி: ${$('#message').value.trim()}`:`Hello Sri Sastha Driving School! I would like to enquire about training.\nName: ${name}\nMobile: ${mobile}\nCourse: ${course}\nPreferred time: ${time}\nMessage: ${$('#message').value.trim()}`;
  const url='https://wa.me/918220204747?text='+encodeURIComponent(message);
  window.open(url,'_blank','noopener,noreferrer');
  $('#form-status').textContent=lang==='ta'?'வாட்ஸ்அப்பில் செய்தியைச் சரிபார்த்து அனுப்பவும்.':'Review and send your enquiry in WhatsApp.'
}
);
$('#name').addEventListener('input',()=>$('#name').setCustomValidity(''));
document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=> {
  $('#lightbox-image').src=b.dataset.src;
  $('#lightbox-image').alt=b.querySelector('img').alt;
  $('#lightbox').showModal()
}
));
$('#close-lightbox').onclick=()=>$('#lightbox').close();
$('#lightbox').addEventListener('click',e=> {
  if(e.target===$('#lightbox'))$('#lightbox').close()
}
);
$('#year').textContent=new Date().getFullYear();
addEventListener('scroll',()=>document.body.classList.toggle('scrolled',scrollY>20), {
  passive:true
}
);
if('IntersectionObserver'in window) {
  document.documentElement.classList.add('js-reveal');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=> {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target)
    }
  }
  ), {
    threshold:.08
  }
  );
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))
}
try {
  if(localStorage.getItem('sastha-language')==='ta')setLanguage('ta')
}
catch {
}
// The opening is brief and is skipped for reduced-motion users.
const intro=document.querySelector('#intro');
function hideIntro() {
  intro.classList.add('done');
  setTimeout(()=>intro.remove(),650)
}
document.querySelector('#skip-intro').onclick=hideIntro;
if(matchMedia('(prefers-reduced-motion: reduce)').matches) {
  intro.remove()
}
else {
  setTimeout(hideIntro,2100)
}
