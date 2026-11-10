# Shraddha's Creation: Smart Digital Business Card

## Personalise
Edit only `js/config.js`. Any value left as `""` is hidden from the public card.
- `whatsapp`: already set. Digits with country code, no `+`.
- `phone`, `email`, `address`, `hours`, `mapsUrl`: contact details and directions.
- `instagram`, `facebook`, `youtube`: social links.
- `publicCardUrl`: the final live link. The QR code and Share/Copy buttons use it.
- `products`: set `image` to a file in `assets/images/` (e.g. `"assets/images/earrings.jpg"`). Until then a "Photo coming soon" placeholder shows. Use JPG/WebP under 200 KB, about 1200x900.

## Run locally
`python3 -m http.server 8000` in this folder, then open http://localhost:8000
(Opening index.html directly also works.)

## Deploy
1. Drag this folder onto https://app.netlify.com/drop (or use Vercel, Cloudflare Pages, GitHub Pages).
2. Copy the live URL into `publicCardUrl` in `js/config.js`, then deploy again.
3. Open the live site, tap "Download QR code", and use the PNG on visiting cards and packaging.

## For other businesses
Copy the folder, replace `assets/images/logo.jpg`, edit `config.js`, and adjust the colour variables at the top of `css/style.css`.

## Final public QR code
The QR code is generated automatically from the live address the card is opened on. Optionally set `publicCardUrl` in `js/config.js` to force a specific link (for example a custom domain).
