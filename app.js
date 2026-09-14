let state = {data:null, filter:'all', query:''};
const $ = (s) => document.querySelector(s);

function statusClass(status){ return ['available','conditional','unavailable'].includes(status) ? status : 'conditional'; }
function formatDate(value){
  const d = new Date(value);
  return new Intl.DateTimeFormat('tr-TR',{dateStyle:'long',timeStyle:'short',timeZone:'Europe/Istanbul'}).format(d);
}
function renderStats(features){
  $('#availableCount').textContent = features.filter(x=>x.status==='available').length;
  $('#conditionalCount').textContent = features.filter(x=>x.status==='conditional').length;
  $('#unavailableCount').textContent = features.filter(x=>x.status==='unavailable').length;
}
function renderFeatures(){
  const f = state.data.features.filter(item => {
    const filterOk = state.filter === 'all' || item.status === state.filter;
    const hay = `${item.title} ${item.category} ${item.summary} ${item.statusLabel}`.toLocaleLowerCase('tr-TR');
    return filterOk && hay.includes(state.query.toLocaleLowerCase('tr-TR'));
  });
  $('#featuresGrid').innerHTML = f.map(item => `
    <article class="feature-card">
      <div class="feature-top"><span class="category">${item.category}</span><span class="badge ${statusClass(item.status)}">${item.statusLabel}</span></div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="device-line">📱 ${item.device}</div>
      <a class="source-link" href="${item.source}" target="_blank" rel="noopener">${item.sourceLabel} ↗</a>
    </article>`).join('');
  $('#emptyState').classList.toggle('hidden', f.length !== 0);
}
function renderTimeline(items){
  $('#timeline').innerHTML = items.map(i => `<article class="timeline-item"><time>${i.date}</time><h3>${i.title}</h3><p>${i.text}</p></article>`).join('');
}
async function renderOfficialFeed(){
  const box=$('#officialFeed');
  try{
    const res=await fetch('data/apple_feed.json',{cache:'no-store'});
    const feed=await res.json();
    if(feed.checkedAt) $('#feedChecked').textContent=`Son kontrol: ${formatDate(feed.checkedAt)}`;
    if(!feed.items || !feed.items.length){
      box.innerHTML='<div class="feed-placeholder">Henüz yeni iOS 27 duyurusu yakalanmadı. GitHub Actions ilk kontrolden sonra burası otomatik dolacak.</div>';
      return;
    }
    box.innerHTML=feed.items.slice(0,8).map(i=>`<a class="feed-item" href="${i.url}" target="_blank" rel="noopener"><span class="feed-source">APPLE NEWSROOM</span><b>${i.title}</b><span>Resmî duyuruyu aç ↗</span></a>`).join('');
  }catch(e){box.innerHTML='<div class="feed-placeholder">Resmî akış şu anda okunamadı.</div>';}
}
async function init(){
  const res = await fetch('data/features.json', {cache:'no-store'});
  state.data = await res.json();
  $('#lastUpdated').textContent = `Son kontrol: ${formatDate(state.data.updatedAt)}`;
  renderStats(state.data.features); renderFeatures(); renderTimeline(state.data.timeline); renderOfficialFeed();
}

document.addEventListener('click', e => {
  const b = e.target.closest('.filter'); if(!b) return;
  document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); state.filter=b.dataset.filter; renderFeatures();
});
$('#searchInput').addEventListener('input', e => { state.query=e.target.value; renderFeatures(); });
$('#themeButton').addEventListener('click',()=>document.body.classList.toggle('light'));
init().catch(err=>{ $('#lastUpdated').textContent='Veri yüklenemedi'; console.error(err); });
