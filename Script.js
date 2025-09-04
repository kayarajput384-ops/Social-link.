// -----------------------------
// Pro dataset (images + videos)
// -----------------------------
const DATA = [
  // Nature
  { id:"n1", type:"image", title:"Misty Forest", tags:["nature","forest","mist"], category:"Nature", src:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" },
  { id:"n2", type:"image", title:"Sunset Lake", tags:["sunset","lake","nature"], category:"Nature", src:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" },
  { id:"n3", type:"image", title:"Mountain Range", tags:["mountain","nature","peaks"], category:"Nature", src:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" },

  // Space
  { id:"s1", type:"image", title:"Aurora Sky", tags:["space","aurora","sky"], category:"Space", src:"https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1600&auto=format&fit=crop" },
  { id:"s2", type:"image", title:"Milky Way", tags:["space","stars","galaxy"], category:"Space", src:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" },

  // Cars
  { id:"c1", type:"image", title:"Red Sports Car", tags:["cars","sports","vehicle"], category:"Cars", src:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop" },
  { id:"c2", type:"image", title:"Classic Coupe", tags:["cars","classic","retro"], category:"Cars", src:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop" },

  // Gaming / Tech
  { id:"g1", type:"image", title:"Futuristic Neon", tags:["gaming","neon","tech"], category:"Gaming", src:"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop" },

  // Movies / Posters
  { id:"m1", type:"image", title:"Retro Movie Poster", tags:["movies","poster","retro"], category:"Movies", src:"https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1600&auto=format&fit=crop" },

  // Videos (sample public)
  { id:"v1", type:"video", title:"City Timelapse", tags:["city","timelapse"], category:"Videos", src:"https://samplelib.com/lib/preview/mp4/sample-960x540.mp4", poster:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop" },
  { id:"v2", type:"video", title:"Nature Reel", tags:["nature","drone"], category:"Videos", src:"https://samplelib.com/lib/preview/mp4/sample-1280x720.mp4", poster:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" }
];

// -----------------------------
// DOM references
// -----------------------------
const grid = document.getElementById('grid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const resultsInfo = document.getElementById('resultsInfo');
const sectionTitle = document.getElementById('sectionTitle');
const quickTags = document.getElementById('quickTags');
const azContainer = document.getElementById('azContainer');
const loadMore = document.getElementById('loadMore');
let currentFilter = 'all';
let itemsPerPage = 8;
let page = 1;
let lastResults = [];

// -----------------------------
// Init categories and quick tags
// -----------------------------
function initUI(){
  // categories
  const cats = ['all', ...Array.from(new Set(DATA.map(d => d.category)))];
  cats.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c.toLowerCase();
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  // quick tags (top tags)
  const allTags = DATA.flatMap(d => d.tags);
  const tagCounts = allTags.reduce((acc,t)=>{acc[t]=(acc[t]||0)+1;return acc;},{});
  const top = Object.keys(tagCounts).sort((a,b)=>tagCounts[b]-tagCounts[a]).slice(0,8);
  top.forEach(t=>{
    const btn = document.createElement('button');
    btn.textContent = t;
    btn.onclick = ()=>{ searchInput.value = t; doSearch(); };
    quickTags.appendChild(btn);
  });

  // A-Z
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach(l=>{
    const el = document.createElement('button');
    el.textContent = l;
    el.className = 'az-letter';
    el.onclick = ()=> azFilter(l);
    azContainer.appendChild(el);
  });

  // keyboard shortcut for search
  window.addEventListener('keydown', e=>{
    if(e.key === '/') { e.preventDefault(); searchInput.focus(); }
  });

  // clear button
  document.getElementById('clearSearch').onclick = ()=>{ searchInput.value=''; doSearch(); };

  // initial render
  doSearch();
}
initUI();

// -----------------------------
// Search & filter logic
// -----------------------------
function normalize(s){ return (s||'').toString().toLowerCase(); }

function matchItem(item, terms){
  // match title, category, tags
  const hay = (item.title + ' ' + item.category + ' ' + (item.tags||[]).join(' ')).toLowerCase();
  return terms.every(t => hay.includes(t));
}

function doSearch(){
  page = 1;
  const q = normalize(searchInput.value).trim();
  const terms = q ? q.split(/\s+/).filter(Boolean) : [];
  const cat = categorySelect.value;

  let results = DATA.filter(d=>{
    if(cat !== 'all' && d.category.toLowerCase() !== cat) return false;
    if(terms.length === 0) return true;
    return matchItem(d, terms);
  });

  // sort (simple)
  if(sortSelect.value === 'new') { /* keep order */ }
  else if(sortSelect.value === 'popular') { /* placeholder */ }
  // relevant: keep as is

  lastResults = results;
  renderPage();
  resultsInfo.textContent = `${results.length} results`;
  sectionTitle.textContent = q ? `Search: "${q}"` : 'Featured';
}

// -----------------------------
// Render page (pagination)
function renderPage(){
  grid.innerHTML = '';
  const start = 0;
  const end = itemsPerPage * page;
  const items = lastResults.slice(0, end);

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-tilt','true');

    const tiltInner = document.createElement('div');
    tiltInner.className = 'tilt-inner';

    if(item.type === 'image'){
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = item.src;
      img.alt = item.title;
      tiltInner.appendChild(img);
    } else if(item.type === 'video'){
      const vid = document.createElement('video');
      vid.poster = item.poster || '';
      vid.src = item.src;
      vid.controls = false;
      vid.muted = true;
      vid.loop = true;
      vid.preload = 'metadata';
      tiltInner.appendChild(vid);
      // small autoplay preview on hover
      card.addEventListener('mouseenter', ()=> { vid.play().catch(()=>{}); });
      card.addEventListener('mouseleave', ()=> { vid.pause(); vid.currentTime = 0; });
    }

    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('div');
    title.className = 'title'; title.textContent = item.title;
    const tags = document.createElement('div');
    tags.className = 'tags'; tags.textContent = item.category;
    meta.appendChild(title); meta.appendChild(tags);

    tiltInner.appendChild(meta);
    card.appendChild(tiltInner);

    // click opens modal
    card.addEventListener('click', ()=> openModal(item) );

    // 3D tilt effect
    enableTilt(card, tiltInner);

    grid.appendChild(card);
  });

  // load more visibility
  document.getElementById('loadMoreWrap').style.display = (lastResults.length > items.length) ? 'block' : 'none';
}

// load more handler
loadMore?.addEventListener('click', ()=>{
  page++;
  renderPage();
});

// -----------------------------
// A-Z filter
function azFilter(letter){
  // show items with category or title starting with letter
  const q = letter.toLowerCase();
  lastResults = DATA.filter(d => d.category.toLowerCase().startsWith(q) || d.title.toLowerCase().startsWith(q));
  page = 1;
  resultsInfo.textContent = `${lastResults.length} results`;
  sectionTitle.textContent = `Filter: ${letter}`;
  renderPage();
}

// -----------------------------
// Modal viewer
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const downloadBtn = document.getElementById('downloadBtn');

function openModal(item){
  modal.classList.remove('hidden');
  modalContent.innerHTML = '';
  if(item.type === 'image'){
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    modalContent.appendChild(img);
    downloadBtn.href = item.src;
    downloadBtn.download = item.title.replace(/\s+/g,'_') + '.jpg';
  } else if(item.type === 'video'){
    const v = document.createElement('video');
    v.src = item.src; v.controls = true; v.autoplay = true; v.style.maxHeight='70vh';
    modalContent.appendChild(v);
    downloadBtn.href = item.src;
    downloadBtn.download = item.title.replace(/\s+/g,'_') + '.mp4';
  }
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  modal.classList.add('hidden');
  modalContent.innerHTML = '';
  document.body.style.overflow = '';
}

// -----------------------------
// Helper: tilt effect
function enableTilt(card, inner){
  card.addEventListener('pointermove', (ev)=>{
    const r = card.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width;
    const py = (ev.clientY - r.top) / r.height;
    const rx = (py - 0.5) * 12; // rotateX
    const ry = (px - 0.5) * -12; // rotateY
    inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('pointerleave', ()=>{ inner.style.transform = ''; });
  card.addEventListener('pointerdown', ()=>{ inner.style.transform += ' scale(0.99)'; });
  card.addEventListener('pointerup', ()=>{ inner.style.transform = ''; });
}

// -----------------------------
// Events
searchInput.addEventListener('input', ()=>{ debounce(doSearch, 220)(); });
categorySelect.addEventListener('change', ()=>{ doSearch(); });
sortSelect.addEventListener('change', ()=>{ doSearch(); });

// debounce util
function debounce(fn, ms=200){
  let t;
  return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
}

// initialize default display (featured = first N)
lastResults = DATA.slice();
renderPage();
resultsInfo.textContent = `${lastResults.length} results`;
