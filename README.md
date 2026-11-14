# Sri Sastha Driving School — Cinematic bilingual website

## Open the website
Extract the complete ZIP. Open `index.html` in Chrome or Edge. Keep the css, js and assets folders beside index.html. No build tools or installation are required. For editing, VS Code Live Server is recommended.

## Structure
- index.html — semantic page structure and English/Tamil content
- css/style.css — all styling and mobile/tablet layouts
- js/app.js — language switching, cinematic entry, hero slideshow, trainer carousel, image preview and enquiry form
- assets/ — included optimized WebP photos and original logo

## Features
- Full-width three-slide automatic hero, five-second interval, thumbnails, arrows and pause/play.
- Short original-logo cinematic reveal, disabled when reduced motion is preferred.
- English/Tamil switch, remembered on the same browser when storage is available.
- Responsive navigation and automatic looping trainer showcase with touch swipe, pause/play, arrows and dots.
- Large 25+ years milestone and women-for-women / men-for-men trainer message.
- Original founder photograph with its actual office background retained.
- Gallery image preview. Escape closes the preview.
- WhatsApp enquiry with required-field validation; no server/database is used.

## Editing content
Each translated element contains `data-en` and `data-ta` text in index.html. Change both values. Trainer portraits are labelled samples; replace assets/trainer-1.webp, trainer-2.webp and trainer-3.webp with actual staff portraits. The middle sample is a woman instructor. Update names and captions only when supplied.

Change business phone links in index.html and the WhatsApp destination in js/app.js together. WhatsApp enquiries open a message for the visitor to review and send; the website does not silently submit or store enquiries.

## Images
The original school logo design is preserved. The founder photograph is supplied by the school. All training/vehicle and sample staff images are generated illustrations and do not document actual staff, vehicles or training locations. Confirm the school's full address, course availability, fees, timings and trainer schedules before broad public promotion. The 25+ years detail and gender-matched trainer service were supplied by the site owner. No No.1 ranking or invented student reviews are included.

## Hosting
Upload the contents of this folder to any static hosting service, keeping relative paths intact. Serve UTF-8 HTML. Google Fonts is optional: system fonts remain as fallbacks when offline. Google Maps opens a place-search directions link; no map API key is required. WhatsApp, call and Maps links need the corresponding external app or internet access.

## Controls
Auto-slide interval: setInterval in js/app.js (5000ms). Logo intro duration: 2100ms in js/app.js. Colors: CSS variables at the top of css/style.css. Main mobile breakpoint: 760px. Reduced motion support is included.

Trainer showcase advances every 3500ms when visible. It pauses on hover, keyboard focus and when the browser tab is hidden. The hero automatically advances every 5000ms; its controls pause it on hover/focus. Both respect reduced-motion preferences.
