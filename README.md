# 🚀 Divyansh Sharma — Portfolio

**Cosmic-themed Full Stack Engineer portfolio** built with React, Vite, Tailwind CSS, and Framer Motion.

---

## ✨ Features

- **Cosmic theme** — animated star field, nebula glows, meteor showers, glassmorphism cards
- **Smooth animations** — Framer Motion entrance animations, scroll-triggered reveals, staggered children
- **Mobile responsive** — fully responsive across all breakpoints
- **Separate project detail routes** — `/project/:id` with full detail view
- **Vertical timeline** — experience section with role cards and tech tags
- **Tilt project cards** — parallax tilt on hover with glare effect
- **Typewriter hero** — animated role cycling with `react-type-animation`
- **Contact form** — EmailJS powered, no backend needed
- **Loading screen** — cosmic orbit animation on first paint
- **404 page** — space-themed not found page
- **SEO ready** — meta tags, OG tags, Twitter card

---

## 🗂️ Project Structure

```
src/
├── assets/
│   └── data/index.js          ← ALL your content lives here
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Experience.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Testimonials.jsx
│   │   └── Contact.jsx
│   └── ui/
│       ├── StarField.jsx
│       ├── Loader.jsx
│       ├── ScrollToTop.jsx
│       └── SectionWrapper.jsx
├── hooks/
│   └── useScrollAnimation.js
├── pages/
│   ├── Home.jsx
│   ├── ProjectDetail.jsx
│   └── NotFound.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🛠️ Setup

### 1. Clone and install

```bash
git clone https://github.com/Divyansh10Sharma/portfolio.git
cd portfolio
npm install
```

### 2. Set up EmailJS (contact form)

1. Create a free account at [emailjs.com](https://emailjs.com)
2. Create a service (Gmail recommended)
3. Create an email template with variables: `{{name}}`, `{{email}}`, `{{message}}`
4. Copy your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxx
```

### 3. Customize your data

Edit `src/assets/data/index.js`:
- Update `heroData` with your name, links, resume URL
- Add/edit `experiences`, `projects`, `testimonials`, `skillCategories`
- Add project images: import them at the top and set `image: yourImage`

### 4. Add project screenshots (optional but recommended)

```js
// In src/assets/data/index.js
import threadImg from "../images/thread.png";

// Then in the project object:
image: threadImg,
```

### 5. Run locally

```bash
npm run dev    # → http://localhost:3000
```

---

## 🚀 Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "feat: portfolio"
git push origin main
```

Then:
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables (from your `.env`) in the Vercel dashboard
7. Deploy 🎉

The `vercel.json` file at root handles SPA routing so `/project/:id` works on refresh.

---

## 🎨 Customization

### Colors (edit `tailwind.config.js`)
```js
cosmic: {
    nebula:  "#915eff",   // Violet — primary accent
    star:    "#00d4ff",   // Cyan — secondary accent
    aurora:  "#9ebc80",   // Green — Train Rex brand color
    comet:   "#f97316",   // Orange — highlights
}
```

### Fonts (loaded via `index.html`)
- **Display**: Orbitron (headings, logo)
- **Body**: Sora (paragraphs, labels)
- **Mono**: JetBrains Mono (tags, code, dates)

### Add a new section
1. Create `src/components/sections/MySection.jsx`
2. Add its id to `navLinks` in `data/index.js`
3. Import and add it to `src/pages/Home.jsx`

---

## 📦 Tech Stack

| Layer       | Tech                                      |
|-------------|-------------------------------------------|
| Framework   | React 18 + Vite 5                         |
| Styling     | Tailwind CSS 3                            |
| Animations  | Framer Motion 11                          |
| Routing     | React Router DOM 6                        |
| Timeline    | react-vertical-timeline-component         |
| Tilt cards  | react-parallax-tilt                       |
| Typewriter  | react-type-animation                      |
| Contact     | emailjs-com                               |
| Icons       | react-icons                               |
| Hosting     | Vercel                                    |
