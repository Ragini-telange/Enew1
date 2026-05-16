// HOMEPAGE JS
document.addEventListener('DOMContentLoaded', () => renderPreviewPlants('all'));

function renderPreviewPlants(cat) {
  const grid = document.getElementById('preview-grid');
  if (!grid) return;
  const list = cat === 'all' ? PLANTS.slice(0,8) : PLANTS.filter(p=>p.cat===cat).slice(0,8);
  grid.innerHTML = list.map(p => {
    const imgSrc = `plant-photos/${p.slug}.jpg`;
    return `<div class="plant-card" onclick="location.href='plants.html'">
      <div class="plant-card-img">
        <img src="${imgSrc}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="plant-card-emoji" style="display:none">${p.emoji}</div>
      </div>
      <div class="plant-card-body">
        <div class="plant-card-name">${p.name}</div>
        <div class="plant-card-sci">${p.sci}</div>
        <div class="plant-tags">
          <span class="plant-tag">${p.cat}</span>
          <span class="plant-tag">☀ ${p.sun}</span>
          <span class="plant-tag">💧 ${p.water}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function previewFilter(cat, btn) {
  document.querySelectorAll('.ptab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderPreviewPlants(cat);
}
