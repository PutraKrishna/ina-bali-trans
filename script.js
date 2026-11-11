// Ina Bali Trans & Travel — interactions
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

// Burger
const burger=$("#burger"),nav=$("#nav");
burger?.addEventListener("click",()=>nav.classList.toggle("open"));

// Sapaan + booking home
(function(){
  const r=$("#booking-result");
  const f=$("#booking-form");
  const d=$("#b-date"); if(d) d.min=new Date().toISOString().slice(0,10);
  f?.addEventListener("submit",e=>{
    e.preventDefault();
    const dest=$("#b-dest").value, tgl=d.value||"segera", pax=$("#b-pax").value;
    r.textContent=`✓ ${dest} tersedia untuk ${tgl} (${pax}). Klik Booking Sekarang untuk amankan slot via WhatsApp.`;
    const msg=`Halo Ina Bali Trans, saya mau cek ${dest} tgl ${tgl} ${pax}`;
    window.open("https://wa.me/6281353182167?text="+encodeURIComponent(msg),"_blank");
  });
})();

// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("show")),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

// Testimoni arrows
$("#t-prev")?.addEventListener("click",()=>$("#testi").scrollBy({left:-340,behavior:"smooth"}));
$("#t-next")?.addEventListener("click",()=>$("#testi").scrollBy({left:340,behavior:"smooth"}));

// ---- Keranjang / Rencana ----
const keranjang=new Map();
try{ (JSON.parse(localStorage.getItem("ina_cart")||"[]")).forEach(i=>keranjang.set(i.id,i)); }catch{}
const save=()=>localStorage.setItem("ina_cart",JSON.stringify([...keranjang.values()]));
function tambahKeranjang(t){const k=t.closest(".product-card");const h=Number(k?.querySelector(".product-price")?.dataset.harga);if(!k||!Number.isFinite(h)||h<=0)return;const id=k.dataset.id;const it=keranjang.get(id);it?it.jumlah++:keranjang.set(id,{id,nama:k.querySelector(".product-title").textContent,harga:h,jumlah:1});save();renderKeranjang();t.textContent="Ditambahkan ✓";setTimeout(()=>t.textContent="+ Rencana",1000);}
function ubahJumlahKeranjang(id,d){const it=keranjang.get(id);if(!it)return;it.jumlah+=d;it.jumlah<=0&&keranjang.delete(id);save();renderKeranjang();}
function hapusDariKeranjang(id){keranjang.delete(id);save();renderKeranjang();}
function renderKeranjang(){const list=$("#daftar-keranjang"),n=$("#jumlah-keranjang"),tot=$("#total-harga"),emp=$("#keranjang-kosong");const j=[...keranjang.values()].reduce((a,i)=>a+i.jumlah,0),t=[...keranjang.values()].reduce((a,i)=>a+i.harga*i.jumlah,0);n&&(n.textContent=j);tot&&(tot.textContent=`Rp ${t.toLocaleString("id-ID")}`);if(list){list.replaceChildren();keranjang.forEach(it=>{const li=document.createElement("li");li.className="cart-item";li.innerHTML=`<div><strong style="font-size:14px">${it.nama}</strong><br/><span style="font-size:13px;color:#8A7565">Rp ${(it.harga*it.jumlah).toLocaleString("id-ID")}</span></div>`;const c=document.createElement("div");c.className="cart-controls";c.innerHTML=`<button type="button">−</button><span>${it.jumlah}</span><button type="button">+</button><button type="button" class="cart-remove">Hapus</button>`;const[b1,,b2,rm]=c.querySelectorAll("button");b1.onclick=()=>ubahJumlahKeranjang(it.id,-1);b2.onclick=()=>ubahJumlahKeranjang(it.id,1);rm.onclick=()=>hapusDariKeranjang(it.id);li.append(c);list.append(li);});}emp&&(emp.hidden=j!==0);}
function lihatDetail(t){const k=t.closest(".product-card");if(!k)return;$("#detail-judul").textContent=`${k.querySelector(".product-title").textContent} — ${k.querySelector(".product-price").textContent}`;$("#detail-isi").textContent=k.querySelector(".product-desc").textContent.trim()+" Termasuk: mobil + driver guide, BBM, tol, parkir. Belum termasuk tiket masuk & makan kecuali tertera.";$("#detail-panel").hidden=false;$("#detail-panel").scrollIntoView({behavior:"smooth",block:"center"});}
function tutupDetail(){$("#detail-panel").hidden=true;}
function terapkanFilter(){const kata=($("#input-cari")?.value??"").trim().toLowerCase();const pil=$$(".cek-kategori:checked").map(e=>e.value);let n=0;$$(".product-card").forEach(it=>{const c=`${it.querySelector(".product-title")?.textContent??""} ${it.querySelector(".product-desc")?.textContent??""} ${it.dataset.kategori??""}`.toLowerCase();const ok=c.includes(kata)&&(pil.length===0||pil.includes(it.dataset.kategori));it.hidden=!ok;ok&&n++;});const p=$("#pesan-kosong");p&&(p.hidden=n!==0);}

document.addEventListener("DOMContentLoaded",()=>{
  $$(".btn-detail").forEach(b=>{if(b.textContent.trim().toLowerCase()==="tutup")return;b.addEventListener("click",()=>lihatDetail(b));});
  $$(".btn-keranjang").forEach(b=>b.addEventListener("click",()=>tambahKeranjang(b)));
  $("#input-cari")?.addEventListener("input",terapkanFilter);
  $("#btn-cari")?.addEventListener("click",terapkanFilter);
  $$(".cek-kategori").forEach(c=>c.addEventListener("change",terapkanFilter));
  renderKeranjang();
  $("#btn-checkout")?.addEventListener("click",()=>{
    if(keranjang.size===0){alert("Pilih paket dulu ya.");return;}
    const lines=[...keranjang.values()].map(i=>`• ${i.nama} x${i.jumlah} — Rp ${(i.harga*i.jumlah).toLocaleString("id-ID")}`);
    const total=[...keranjang.values()].reduce((a,i)=>a+i.harga*i.jumlah,0);
    window.open("https://wa.me/6281353182167?text="+encodeURIComponent(`Halo Ina Bali Trans, saya mau booking:\n${lines.join("\n")}\nTotal estimasi: Rp ${total.toLocaleString("id-ID")}`),"_blank");
  });
  // Kontak form -> WA
  $("#kontak-form")?.addEventListener("submit",e=>{
    e.preventDefault();
    const n=$("#k-nama").value.trim(),w=$("#k-wa").value.trim(),m=$("#k-pesan").value.trim();
    if(n.length<3||m.length<5){$("#k-error").textContent="Lengkapi nama & pesan (min. 5 karakter).";return;}
    $("#k-error").textContent="";
    window.open("https://wa.me/6281353182167?text="+encodeURIComponent(`Halo Ina Bali Trans!\nNama: ${n}\nWA: ${w}\nKebutuhan: ${$("#k-need").value}\nPesan: ${m}`),"_blank");
  });
});
