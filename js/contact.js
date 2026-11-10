window.Contact = (function () {
  const esc = s => String(s).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  function vcf(c) {
    const L = ["BEGIN:VCARD", "VERSION:3.0"];
    const name = c.ownerName || c.businessName;
    L.push("FN:" + esc(name), "N:" + esc(c.ownerName ? c.ownerName : c.businessName) + ";;;;", "ORG:" + esc(c.businessName), "TITLE:" + esc(c.category));
    if (c.phone) L.push("TEL;TYPE=CELL:" + c.phone);
    if (c.whatsapp && c.whatsapp.replace(/\D/g, "") !== (c.phone || "").replace(/\D/g, "")) L.push("TEL;TYPE=CELL,VOICE:+" + c.whatsapp.replace(/\D/g, ""));
    if (c.email) L.push("EMAIL:" + c.email);
    if (c.address) L.push("ADR;TYPE=WORK:;;" + esc(c.address) + ";;;;");
    if (c.publicCardUrl) L.push("URL:" + c.publicCardUrl);
    L.push("END:VCARD");
    return L.join("\r\n");
  }
  function saveContact(c) {
    const blob = new Blob([vcf(c)], { type: "text/vcard;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = c.businessName.replace(/[^\w]+/g, "-").toLowerCase() + ".vcf";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (_) {}
      t.remove(); return ok;
    }
  }
  async function share(c, url) {
    const data = { title: c.businessName, text: c.businessName + " - " + c.tagline, url };
    if (navigator.share) { try { await navigator.share(data); return "shared"; } catch (e) { if (e.name === "AbortError") return "cancelled"; } }
    return (await copy(url)) ? "copied" : "failed";
  }
  return { vcf, saveContact, copy, share };
})();
