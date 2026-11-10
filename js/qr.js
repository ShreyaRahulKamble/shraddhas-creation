window.QR = (function () {
  function draw(canvas, text, size) {
    const qr = qrcode(0, "H"); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), quiet = 4, cell = Math.floor(size / (n + quiet * 2));
    const px = cell * (n + quiet * 2);
    canvas.width = canvas.height = px;
    const g = canvas.getContext("2d");
    g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, px, px);
    g.fillStyle = "#1a1714";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) g.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
  }
  function download(text, filename) {
    const big = document.createElement("canvas"); draw(big, text, 1200);
    big.toBlob(b => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = filename;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  }
  return { draw, download };
})();
