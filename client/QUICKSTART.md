# Landing Page - Quick Start Guide

## Setup & Running

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## File Overview

| File | Purpose | Lines |
|------|---------|-------|
| `src/pages/Landing.jsx` | Main landing page with all sections | ~450 |
| `src/components/Navbar.jsx` | Fixed navigation bar | ~180 |
| `src/components/FeatureCard.jsx` | Reusable feature card | ~20 |
| `src/components/Footer.jsx` | Footer with links | ~100 |
| `src/App.jsx` | App routing and scroll setup | ~40 |

---

## Landing Page Sections

### 1️⃣ Hero Section (Landing.jsx: lines 30-110)
- Large heading with gradient text
- Description and CTA buttons
- Chat interface mockup
- Responsive grid layout

**Edit:**
```jsx
// Change heading
<h1 className="...">
  Your Custom Heading Here
</h1>

// Change buttons
<Link to="/your-route">Custom Button</Link>
```

### 2️⃣ Features Section (Landing.jsx: lines 112-150)
- 6-card grid of features
- Uses FeatureCard component
- Responsive 1-3 column layout

**Edit:**
```jsx
const features = [
  {
    icon: '💬',
    title: 'Your Feature',
    description: 'Your description'
  },
  // ... more features
]
```

### 3️⃣ How It Works (Landing.jsx: lines 152-210)
- 3-step process with connecting arrows
- Card-based layout
- Desktop only arrows

**Edit:**
```jsx
const steps = [
  {
    number: '01',
    title: 'Your Step',
    description: 'Your description'
  },
  // ... more steps
]
```

### 4️⃣ About Section (Landing.jsx: lines 212-260)
- Platform description
- 3 statistics cards
- Dark/light mode support

**Edit:**
```jsx
// Modify text
<p>Your about text here</p>

// Change statistics
<div className="text-4xl font-bold">YOUR NUMBER</div>
```

### 5️⃣ CTA Section (Landing.jsx: lines 262-290)
- Call-to-action with buttons
- Gradient background
- Hidden if user is logged in

---

## Component Usage Examples

### Using FeatureCard
```jsx
import FeatureCard from './components/FeatureCard'

<FeatureCard
  icon="💬"
  title="Chat Assistant"
  description="Get instant responses"
/>
```

### Using Navbar
```jsx
import Navbar from './components/Navbar'

// Automatically handles:
// - Dark mode toggle
// - User authentication state
// - Mobile menu
// - Smooth navigation
<Navbar />
```

### Using Footer
```jsx
import Footer from './components/Footer'

// Automatically shows:
// - Brand info
// - Footer links
// - Social icons
// - Current year
<Footer />
```

---

## Customization Quick Tips

### 🎨 Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: '#6366f1',      // Change primary blue
  secondary: '#8b5cf6',    // Change secondary purple
}
```

### 📝 Text Content
Edit values in `Landing.jsx`:
- Headings: Search for `<h1>`, `<h2>`
- Descriptions: Search for `<p>`
- Button text: Search for `<Link>`

### 🖼️ Icons
Change emoji in features/steps:
```jsx
// Change this
icon: '💬'

// To this
icon: '🎯'
```

### 🔗 Links
Update navigation targets:
```jsx
<Link to="/custom-route">Link Text</Link>
<a href="#section-id">Anchor Link</a>
```

---

## Responsive Design

### Mobile (< 768px)
- 1-column grid for features
- Stacked steps
- Hamburger menu
- Full-width buttons

### Tablet (768px - 1024px)
- 2-column grid
- Adjusted spacing

### Desktop (> 1024px)
- 3-column grid
- Full navigation
- Horizontal steps
- Connecting arrows

**Test:** Use browser DevTools Ctrl+Shift+I → Toggle device toolbar (Ctrl+Shift+M)

---

## Dark Mode

### Auto-Enabled
- Uses `useTheme()` context
- Toggle button in Navbar (☀️/🌙)
- Persists to localStorage
- CSS dark: prefix

### Test Dark Mode
1. Click moon icon in navbar
2. Check localStorage: `theme: 'dark'`
3. Refresh page - should stay dark

---

## Authentication Integration

### Auto-Displays Based on Login State
```jsx
const { user } = useAuth()

{user ? (
  <Link to="/chat">Go to Chat</Link>
) : (
  <>
    <Link to="/register">Get Started</Link>
    <Link to="/login">Try Demo</Link>
  </>
)}
```

### Test Auth
1. Go to `/login` (not implemented yet)
2. After login, navbar shows username
3. Hero buttons change to "Go to Chat"

---

## Smooth Scrolling

### How It Works
- Navbar links use anchor: `href="#features"`
- Landing page sections have IDs: `id="features"`
- App.jsx handles smooth scroll on route change

### Test
1. Click "Features" in navbar
2. Page smoothly scrolls to features section
3. Works with browser back/forward

---

## Performance Checklist

✅ No external UI libraries (Tailwind only)
✅ CSS animations (not JavaScript)
✅ Minimal component re-renders
✅ No heavy external dependencies
✅ Fast load time
✅ Mobile-optimized

---

## Common Tasks

### Add New Feature Card
```jsx
// In Landing.jsx, update features array:
{
  icon: '🎯',
  title: 'New Feature Name',
  description: 'Feature description text here'
}
```

### Change Button Color
```jsx
// Change from primary to custom color
className="bg-primary hover:bg-secondary"
// To
className="bg-blue-500 hover:bg-blue-600"
```

### Add New Navigation Link
```jsx
// In Navbar.jsx, update navLinks:
{
  label: 'New Link',
  href: '#section-id'
}

// Then add matching section in Landing.jsx:
<section id="section-id">
  Your content here
</section>
```

### Hide CTA Section for All Users
```jsx
// In Landing.jsx, remove or comment:
{/* CTA Section */}
{/* <section>...</section> */}
```

---

## Troubleshooting

### Landing page looks broken?
- Check `npm install` completed
- Verify Tailwind CSS loaded (check DevTools Styles)
- Clear browser cache (Ctrl+Shift+Delete)

### Dark mode not working?
- Check ThemeContext is provided in App.jsx
- Verify localStorage allows `theme` key
- Check CSS has `dark:` classes

### Smooth scrolling not working?
- Ensure section has matching ID: `id="features"`
- Check anchor link href matches: `href="#features"`
- Verify ScrollToSection component in App.jsx

### Buttons not navigating?
- Check React Router is set up
- Verify routes in App.jsx
- Check Link `to` props match route paths

### Mobile menu not closing?
- Check `setIsMenuOpen(false)` on link click
- Test on actual mobile device (DevTools mobile mode)
- Check z-index conflicts

---

## Deploy to Production

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy
```bash
# Using Vercel
npm install -g vercel
vercel

# Using Netlify
netlify deploy --prod --dir=dist

# Using GitHub Pages
npm run build
# Push dist folder to gh-pages branch
```

---

## Next Steps

1. ✅ Landing page created
2. ⬜ Implement Login/Register pages
3. ⬜ Connect to backend API
4. ⬜ Add real chat functionality
5. ⬜ Implement chat history
6. ⬜ Add admin dashboard

---

## Support

For issues:
1. Check LANDING_PAGE.md for details
2. Check COMPONENT_GUIDE.md for component info
3. Review console errors (DevTools)
4. Test in incognito mode
5. Clear cache and rebuild

---

**Created:** February 2026
**Framework:** React 18 + Vite + Tailwind CSS
**Type:** Production-Ready Landing Page
