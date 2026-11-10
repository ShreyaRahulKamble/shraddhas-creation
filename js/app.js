(function () {
  const C = window.CARD_CONFIG, $ = s => document.querySelector(s);
  const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const wa = C.whatsapp.replace(/\D/g, "");
  const waLink = msg => "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg);
  const isDev = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  const cardUrl = C.publicCardUrl || "";
  const icons = {
    wa: '<path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.3-2.300l.8-1-1-2z"/>',
    call: '<path d="M5 4h4l2 5-2.5 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    save: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 10.800l7.4-3.600M8.3 13.200l7.4 3.6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r=".8"/>',
    fb: '<path d="M14 8h2V5h-2.500A3.5 3.5 0 0 0 10 8.500V11H8v3h2v6h3v-6h2.500l.5-3h-3V8.700c0-.4.3-.7 1-.7z"/>',
    yt: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9.5 5 2.5-5 2.500z"/>'
  };
  const ico = k => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + icons[k] + "</svg>";

  document.title = C.businessName + " | " + C.category;
  document.querySelectorAll("[data-cfg]").forEach(n => { n.textContent = C[n.dataset.cfg] || ""; });

  /* Products */
  const grid = $("#productGrid");
  C.products.forEach((p, i) => {
    const media = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<div class="ph"><svg viewBox="0 0 24 24" class="ph-gem"><path d="M6 4h12l4 6-10 11L2 10z M2 10h20 M9 4l-2 6 5 11 5-11-2-6"/></svg><span>Photo coming soon</span></div>';
    const card = el('<article class="card reveal"><button class="media" type="button" data-i="' + i + '" aria-label="View ' + esc(p.name) + ' larger">' + media + '</button><div class="body"><h3>' + esc(p.name) +
      "</h3><p>" + esc(p.description) + "</p>" + (p.price ? '<div class="price">' + esc(p.price) + "</div>" : "") +
      (wa ? '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + waLink("Hello! I am interested in " + p.name + " from " + C.businessName + ". Could you please share more details?") + '">' + ico("wa") + "Enquire on WhatsApp</a>" : "") +
      "</div></article>");
    card.style.transitionDelay = (i % 2) * 90 + "ms";
    grid.appendChild(card);
  });

  /* Connect actions */
  const act = $("#actions");
  const add = (cls, icon, label, attrs, fn) => {
    const b = el("<" + (attrs ? "a" : "button") + ' class="act ' + cls + '" ' + (attrs || 'type="button"') + ">" + ico(icon) + "<span>" + label + "</span></" + (attrs ? "a" : "button") + ">");
    if (fn) b.addEventListener("click", fn); act.appendChild(b);
  };
  add("", "save", "Save Contact", "", () => { Contact.saveContact(C); toast("Contact file downloaded"); });
  if (wa) add("", "wa", "WhatsApp", 'href="' + waLink("Hello " + C.businessName + "!") + '" target="_blank" rel="noopener"');
  if (C.phone) add("", "call", "Call Now", 'href="tel:' + esc(C.phone.replace(/\s/g, "")) + '"', () => setTimeout(async () => { if (document.visibilityState === "visible" && document.hasFocus()) { await Contact.copy(C.phone); toast("Dialler unavailable here. Number " + C.phone + " copied."); } }, 900));
  if (C.email) add("", "mail", "Email", 'href="mailto:' + esc(C.email) + '"');
  add("", "share", "Share Card", "", shareCard);
  add("", "copy", "Copy Link", "", async () => toast((await Contact.copy(cardUrl || location.href)) ? "Link copied" : "Could not copy link"));
  if (wa) { const f = $("#chatFab"); f.href = waLink("Hello " + C.businessName + "!"); f.hidden = false; }

  /* Lightbox */
  const lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), pics = C.products.filter(p => p.image); let cur = 0;
  const show = i => { cur = (i + pics.length) % pics.length; lbImg.src = pics[cur].image; lbImg.alt = pics[cur].name; lbCap.textContent = pics[cur].name; };
  const openLb = i => { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
  grid.addEventListener("click", e => { const m = e.target.closest(".media"); if (!m) return; const p = C.products[+m.dataset.i]; if (p.image) openLb(pics.indexOf(p)); });
  $("#lbClose").onclick = closeLb; $("#lbPrev").onclick = () => show(cur - 1); $("#lbNext").onclick = () => show(cur + 1);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
  let sx = 0; lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });
  const hw = $("#heroWa"); if (wa) { hw.href = waLink("Hello " + C.businessName + "!"); hw.hidden = false; }
  $("#qrShare").addEventListener("click", shareCard);

  /* Share: native sheet when the browser allows it, otherwise our own share options */
  async function shareCard() {
    const url = cardUrl || location.href;
    if (navigator.share) { try { await navigator.share({ title: C.businessName, text: C.businessName + " - " + C.tagline, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
    const t = encodeURIComponent(C.businessName + " - " + C.tagline), u = encodeURIComponent(url);
    const box = $("#sheetLinks"); box.innerHTML = "";
    [["WhatsApp", "https://wa.me/?text=" + t + "%20" + u], ["Telegram", "https://t.me/share/url?url=" + u + "&text=" + t], ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + u], ["Email", "mailto:?subject=" + encodeURIComponent(C.businessName) + "&body=" + t + "%20" + u]]
      .forEach(([n, h]) => box.appendChild(el('<a class="act" target="_blank" rel="noopener" href="' + h + '"><span>' + n + "</span></a>")));
    const cp = el('<button class="act" type="button"><span>Copy Link</span></button>');
    cp.onclick = async () => { toast((await Contact.copy(url)) ? "Link copied" : "Could not copy link"); $("#sheet").hidden = true; };
    box.appendChild(cp); $("#sheet").hidden = false;
  }
  $("#sheetClose").onclick = () => { $("#sheet").hidden = true; };
  $("#sheet").addEventListener("click", e => { if (e.target.id === "sheet") $("#sheet").hidden = true; });

  /* Info */
  const info = $("#infoList");
  const row = (i, label, html) => info.appendChild(el('<li>' + ico(i) + "<div><b>" + label + "</b><span>" + html + "</span></div></li>"));
  if (C.address) row("pin", "Visit us", esc(C.address));
  if (C.hours) row("clock", "Hours", esc(C.hours));
  if (C.phone) row("call", "Phone", '<a href="tel:' + esc(C.phone.replace(/\s/g, "")) + '">' + esc(C.phone) + "</a>");
  if (C.email) row("mail", "Email", '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>");
  const dir = C.mapsUrl || (C.address ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.address) : "");
  if (dir) { const d = $("#dirBtn"); d.href = dir; d.hidden = false; }
  if (!info.children.length && !dir) $("#info").hidden = true;

  /* Social */
  const soc = $("#social");
  [["instagram", "ig", "Instagram"], ["facebook", "fb", "Facebook"], ["youtube", "yt", "YouTube"]].forEach(([k, i, n]) => {
    if (C[k]) soc.appendChild(el('<a class="soc" target="_blank" rel="noopener" aria-label="' + n + '" href="' + esc(C[k]) + '">' + ico(i) + "<span>" + n + " \u00b7 Follow Us</span></a>"));
  });
  if (!soc.children.length) soc.hidden = true;

  /* QR */
  const qrBox = $("#qr");
  const autoUrl = (!isDev && /^https?:$/.test(location.protocol)) ? location.href.split("#")[0].split("?")[0] : "";
  const qrUrl = cardUrl || autoUrl;
  if (qrUrl) {
    QR.draw($("#qrCanvas"), qrUrl, 720);
    $("#qrUrl").textContent = qrUrl.replace(/^https?:\/\//, "");
    $("#qrDl").addEventListener("click", () => QR.download(qrUrl, "shraddhas-creation-qr.png"));
  } else if (isDev) {
    qrBox.querySelector(".qr-wrap").innerHTML = '<p class="note">Developer note: set <code>publicCardUrl</code> in js/config.js to generate the QR code. This message is only shown on localhost.</p>';
    $("#qrDl").hidden = true;
  } else qrBox.hidden = true;

  /* Toast */
  let tt; function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); }

  /* Reveal on scroll */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll(".reveal").forEach(n => io ? io.observe(n) : n.classList.add("in"));

  /* Loader */
  const hide = () => { document.body.classList.add("ready"); setTimeout(() => { const l = $("#loader"); l && l.remove(); }, 700); };
  window.addEventListener("load", () => setTimeout(hide, 500)); setTimeout(hide, 3000);
})();
