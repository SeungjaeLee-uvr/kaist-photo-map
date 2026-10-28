import {hasGPS,photoPath,validateManifest,directionCone} from './core.mjs?v=2';
const $=id=>document.getElementById(id);
let photos=[],selected=null,map,directionLayer;
const markers=new Map();
function icon(active){
  return L.divIcon({className:'',html:`<span class="pin${active?' active':''}"></span>`,iconSize:[24,24],iconAnchor:[12,12]});
}
function select(photo){
  selected=photo;
  setPanel(true);
  $('photo').src=photoPath(photo.name);$('photo').alt=photo.name;
  $('selected').hidden=false;
  $('status').hidden=true;
  document.querySelectorAll('#thumbnails button').forEach((button,i)=>{
    const active=photos[i]===photo;
    button.setAttribute('aria-pressed',String(active));
    if(active)button.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
  });
  markers.forEach((marker,p)=>{marker.setIcon(icon(p===photo));marker.setZIndexOffset(p===photo?1000:0);});
  if(directionLayer){directionLayer.remove();directionLayer=null;}
  const cone=directionCone(photo);
  if(map&&cone.length)directionLayer=L.polygon(cone,{color:'#ad713b',weight:1,fillColor:'#d7964a',fillOpacity:.3,interactive:false}).addTo(map);
  if(map&&hasGPS(photo))map.setView([photo.latitude,photo.longitude],Math.max(map.getZoom(),17));
}
function setPanel(open){
  $('photos').hidden=!open;
  $('layout').classList.toggle('map-only',!open);
  map?.invalidateSize({pan:false});
}
$('close-panel').onclick=()=>{
  setPanel(false);
  if(directionLayer){directionLayer.remove();directionLayer=null;}
  markers.get(selected)?.getElement()?.focus();
};
function openViewer(){
  if(!selected)return;
  $('large').src=photoPath(selected.name);$('large').alt=selected.name;$('viewer').showModal();
}
$('selected').onclick=openViewer;
$('close').onclick=()=>$('viewer').close();
$('photo').onerror=()=>{$('status').textContent='사진을 불러올 수 없어요.';$('status').hidden=false;};
async function init(){
  if(window.L){
    map=L.map('map',{zoomControl:false}).setView([36.372,127.3604],15);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    tiles.on('tileerror',()=>{if(!photos.length)$('status').textContent='지도를 불러올 수 없어요. 인터넷 연결을 확인해 주세요.';});
  }else $('map').textContent='지도를 불러올 수 없어요. 인터넷 연결을 확인해 주세요.';
  try{
    const response=await fetch('./photos.json');
    if(!response.ok)throw new Error('사진 목록 불러오기 실패');
    photos=validateManifest(await response.json());
    for(const photo of photos){
      const button=document.createElement('button');
      button.setAttribute('aria-label',photo.name);button.setAttribute('aria-pressed','false');
      const image=document.createElement('img');image.src='./photos/thumbs/'+encodeURIComponent(photo.name);image.alt='';image.loading='lazy';
      button.append(image);button.onclick=()=>select(photo);$('thumbnails').append(button);
      if(map&&hasGPS(photo)){
        const marker=L.marker([photo.latitude,photo.longitude],{icon:icon(false),title:photo.name}).addTo(map);
        marker.on('click',()=>select(photo));markers.set(photo,marker);
      }
    }
    $('thumbnails').hidden=photos.length<2;
    if(photos.length){
      const points=photos.filter(hasGPS).map(p=>[p.latitude,p.longitude]);
      if(points.length)map?.fitBounds(points,{padding:[35,35],maxZoom:17});
    }
  }catch(error){$('status').hidden=false;$('status').textContent=error.message;}
}
if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});
