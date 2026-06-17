# The Haven Place

A premium lifestyle hospitality brand landing page built for discerning travelers, remote professionals, and creators. The website merges highly secure, architecturally stunning shortlet accommodations with **Twilight Haven**—a health-conscious cloud kitchen—providing a complete luxury sanctuary.

---

## ✨ Key Features

- **Premium Responsive Navigation:** Features a fixed header that transitions from transparent to solid dark on scroll, with a custom mobile dropdown menu utilizing scroll-locking states.
- **Services Showcase:** A beautifully styled grid outlining our core offerings—from premium shortlets and executive creative workspaces to staycation hosting and wellness retreats.
- **The Sanctuary Collection (Masonry Gallery):** An uncropped, Pinterest-style masonry grid displaying our stays. Clicking any photo opens a custom-engineered, touch-sensitive **Lightbox Modal**.
- **Interactive Lightbox Zoom & Pan:**
  - **Pinch-to-Zoom:** Mobile-native multi-touch zooming (scale ranges from `1x` to `4x`).
  - **Pivoted Drag-to-Pan:** Smooth panning when zoomed, dynamically constrained to keep the image centered and within bounds.
  - **Mouse Wheel Zoom:** Precise scrolling-based scaling centered on the cursor on desktop.
  - **Double-Tap / Double-Click Toggle:** Instantly toggle between fitted scale (`1x`) and detailed view (`2.5x`) centered at the point of action.
  - **Contextual Pointer States:** Smooth cursor transition between standard default and grab/grabbing indicators depending on zoom state.
- **The Haven Promise Carousel:** Mobile-optimized, touch-swipeable horizontal cards featuring scroll snapping (`scroll-snap-type: x mandatory`).
- **Gourmet Wellness Section:** Showcases Twilight Haven with a custom, premium generated brand graphic.
- **Custom Select Dropdown:** Form dropdown implementing modern customizable select element features (`appearance: base-select` and `::picker(select)`) styled to match the dark-gold and cream luxury palette.
- **Asset Protection:** Multi-layer security blocking drag-and-drop and context-menu saves on brand images.

---

## 🛠️ Technology Stack

- **Markup:** Semantic HTML5
- **Styling:** Modern Vanilla CSS3 utilizing:
  - Custom properties (CSS variables) for design system tokens.
  - Fluid typography (`clamp()`) and flex/grid media queries.
  - Modern Select Picker API selectors and CSS Anchor Positioning.
- **Logic:** Vanilla ES6+ JavaScript:
  - Scroll-linked Intersection Observer for fading-in elements (`.reveal`).
  - Complex pointer and touch tracking math for device-gallery interactions.
- **Deployment:** Preconfigured for **Vercel** with custom routing and security configurations.

---

## 📁 Project Structure

```text
├── images/
│   ├── logo.jpeg              # Brand logo image
│   ├── havenHouse.jpeg        # About/Residence exterior photo
│   ├── twilight_kitchen.png   # Premium cloud kitchen cuisine photo
│   └── img4.jpeg - img15.jpeg # Gallery stays collection photos
├── index.html                 # Main structure and content file
├── style.css                  # Core design system stylesheet
├── script.js                  # Navigation, lightbox, zoom & pan scripts
├── vercel.json                # Vercel deployment configuration
└── README.md                  # Project documentation
```

---

## 🚀 Local Development

Since this is a lightweight, high-performance static website, you do not need a compiler. 

### Option 1: Live Server (Recommended)
1. Open the project folder in your preferred editor (e.g. VS Code).
2. Install the **Live Server** extension.
3. Click **Go Live** at the bottom right corner of the status bar.

### Option 2: Local Open
Double-click the `index.html` file to open it directly in any modern web browser.

---

## 🌐 Vercel Production Deployment

The codebase includes a preconfigured [vercel.json](file:///c:/dev/Haven%20Place/vercel.json) file that enforces production-ready standards:
- **Clean URLs:** Routes automatically strip trailing slashes and clean paths (e.g., `/index` to `/`).
- **Security Headers:** Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and a tight `Content-Security-Policy`.
- **Advanced Asset Caching:** Serves all moved images inside the `/images` directory with immutable caching headers (`Cache-Control: public, max-age=31536000, immutable`) to guarantee optimal loading speeds.

To deploy:
1. Push your changes to GitHub (already configured on the `main` branch).
2. Import the repository into your **Vercel Dashboard**.
3. Vercel will auto-detect the static configuration and host the sanctuary landing page in seconds.

---

## 🔒 Asset Security & Caching Details

- **Right-Click / Drag Blocker:** Image tags reject direct user saves and drag actions.
- **CSS Pointer Events Overlay:** Clicks on images bypass the element to target containers directly, ensuring user interaction goes through code layers.
