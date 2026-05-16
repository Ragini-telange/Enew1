let activeCat = 'all', selectedPlant = null;
document.addEventListener('DOMContentLoaded', filterPlants);

function setCategory(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.ptab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); filterPlants();
}

function filterPlants() {
  const search = (document.getElementById('plant-search')?.value||'').toLowerCase();
  const grid = document.getElementById('plants-grid');
  const filtered = PLANTS.filter(p => {
    const matchCat = activeCat === 'all' || p.cat === activeCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.sci.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });
  if (!filtered.length) { grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)"><div style="font-size:2.5rem;margin-bottom:12px">🔍</div>No plants found.</div>`; return; }
  grid.innerHTML = filtered.map(p => {
    const img = `plant-photos/${p.slug}.jpg`;
    return `<div class="plant-card" onclick="openPlantModal('${p.name}')">
      <div class="plant-card-img">
        <img src="${img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="plant-card-emoji" style="display:none">${p.emoji}</div>
      </div>
      <div class="plant-card-body">
        <div class="plant-card-name">${p.name}</div>
        <div class="plant-card-sci">${p.sci}</div>
        <div class="plant-tags"><span class="plant-tag">${p.cat}</span><span class="plant-tag">☀ ${p.sun}</span><span class="plant-tag">💧 ${p.water}</span></div>
      </div>
    </div>`;
  }).join('');
}

function openPlantModal(name) {
  const p = PLANTS.find(x=>x.name===name); if(!p) return;
  selectedPlant = p;
  const img = `plant-photos/${p.slug}.jpg`;
  document.getElementById('m-img').src = img;
  document.getElementById('m-img').style.display = 'block';
  document.getElementById('m-emoji-fb').style.display = 'none';
  document.getElementById('m-emoji-fb').textContent = p.emoji;
  document.getElementById('m-name').textContent = p.name;
  document.getElementById('m-sci').textContent = p.sci;
  document.getElementById('m-cat').textContent = p.cat.charAt(0).toUpperCase()+p.cat.slice(1);
  document.getElementById('m-sun').textContent = p.sun;
  document.getElementById('m-water').textContent = p.water;
  document.getElementById('m-diff').textContent = p.difficulty;
  document.getElementById('m-desc').textContent = p.desc;
  document.getElementById('m-care').textContent = p.care;
  document.getElementById('m-benefits').textContent = p.benefits;
  document.getElementById('plant-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) { if(e.target.id==='plant-modal') closePlantModal(); }
function closePlantModal() { document.getElementById('plant-modal').classList.remove('open'); document.body.style.overflow=''; }

async function addFromModal() {
  if(!selectedPlant) return;
  if(!isLoggedIn()) { showToast('Please login to add plants','error'); setTimeout(()=>location.href='login.html',1500); return; }
  try {
    await apiRequest('POST','/my-plants',{plant_name:selectedPlant.name,plant_emoji:selectedPlant.emoji},true);
    showToast(selectedPlant.name+' added! +100 XP 🌱'); closePlantModal();
  } catch(e) { showToast(e.message,'error'); }
}
