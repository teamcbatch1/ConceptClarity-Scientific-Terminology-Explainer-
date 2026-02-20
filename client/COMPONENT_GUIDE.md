# Landing Page Component Guide

## File Structure
```
client/src/
├── pages/
│   └── Landing.jsx          (Main landing page with all sections)
├── components/
│   ├── Navbar.jsx           (Fixed navigation bar)
│   ├── FeatureCard.jsx      (Reusable feature card)
│   └── Footer.jsx           (Footer with links and socials)
└── App.jsx                  (Router setup with smooth scroll)
```

## Component Breakdown

### 1. Navbar.jsx

**Props:** None (uses Context hooks)

**Hooks Used:**
- `useState` - Menu open/close state
- `useAuth()` - User authentication context
- `useTheme()` - Dark/light mode context
- `useNavigate()` - Route navigation

**Features:**
- Fixed position with z-50
- Gradient logo text
- Responsive hamburger menu (hidden on md+)
- Theme toggle button (☀️/🌙)
- Conditional rendering for authenticated/unauthenticated users
- Smooth transitions and hover effects
- Mobile menu with dropdown

**Responsive Behavior:**
- Mobile: Menu button visible, nav links hidden
- Tablet/Desktop: Nav links visible, menu button hidden
- Menu item padding: 2-8 responsive

---

### 2. Landing.jsx

**Props:** None

**Hooks Used:**
- `useAuth()` - Check if user is logged in

**Data Structures:**
```jsx
features = [
  { icon: emoji, title: string, description: string },
  // 6 feature objects
]

steps = [
  { number: string, title: string, description: string },
  // 3 step objects
]
```

**Sections:**

#### Hero Section
- Grid layout (1 col mobile, 2 col desktop)
- Left: Heading, description, CTA buttons, badges
- Right: Chat interface mockup
- Conditional buttons based on auth state
- Gradient backgrounds

#### Features Section
- Section heading with description
- 3-column responsive grid (1 col mobile)
- Each cell: FeatureCard component
- 8-unit gap between cards

#### How It Works Section
- 3-step horizontal layout
- Each step in a card with gradient circle number
- Desktop: Arrow connectors between cards
- Mobile: Stacked vertically

#### About Section
- Text content area
- 3 statistics in grid (1-3 col responsive)
- Large numbers with descriptions

#### CTA Section
- Full-width gradient background
- Centered heading and description
- Two buttons (Get Started Free, Login)
- Hidden if user is authenticated

---

### 3. FeatureCard.jsx

**Props:**
```jsx
{
  icon: string,         // Emoji or SVG
  title: string,        // Feature title
  description: string   // Feature description
}
```

**Features:**
- Gradient circle background for icon
- Card shadow with hover effect
- Scale up (105%) on hover
- Smooth transitions
- Dark mode support
- Rounded corners (xl)

**Example Usage:**
```jsx
<FeatureCard
  icon="💬"
  title="AI Chat Assistant"
  description="Ask any FinTech question and get instant, accurate explanations powered by advanced AI."
/>
```

---

### 4. Footer.jsx

**Props:** None (uses useLocation hook implicitly)

**Data Structure:**
```jsx
footerLinks = {
  Product: [{ label, href }, ...],
  Company: [{ label, href }, ...],
  Legal: [{ label, href }, ...]
}
```

**Features:**
- 4-column grid (1 col mobile, 4 col desktop)
- Brand section with description
- Link categories
- Social media icons
- Dynamic copyright year
- Contact email
- Hover effects on links

---

## Styling Details

### Typography
- H1 (Hero): 48px-60px, font-bold, gradient text
- H2 (Section): 36px-48px, font-bold
- H3 (Card/Step): 18px-20px, font-bold
- P (Body): 16px-18px, font-normal
- P (Small): 12px-14px, font-small

### Spacing
- Hero: pt-32 pb-20
- Sections: py-20
- Cards gap: gap-8
- Text spacing: mb-4 to mb-8

### Colors
```css
Text:
- Primary: text-gray-900 (light), text-white (dark)
- Secondary: text-gray-600 (light), text-gray-400 (dark)
- Link: text-primary hover:text-secondary

Background:
- Light: bg-white, bg-gray-50
- Dark: bg-gray-950, bg-gray-900
- Gradient: from-primary to-secondary
```

### Shadows
- Card: shadow-lg
- Card Hover: shadow-2xl
- Button Hover: shadow-2xl

### Border Radius
- Default: rounded-lg (8px)
- Large: rounded-xl (12px)
- Full: rounded-full (50%)

---

## Interactive States

### Buttons
```
Default: bg-primary text-white
Hover: bg-secondary shadow-2xl scale-105
Active: Darker shade
Disabled: opacity-50
```

### Links
```
Default: text-gray-700 dark:text-gray-300
Hover: text-primary
Active: Underline
```

### Cards
```
Default: shadow-lg
Hover: shadow-2xl scale-105 -translate-y-2
```

---

## Responsive Behavior

### Mobile-First Approach
```
Mobile (< 768px):
- 1-column grid for features
- Stacked steps
- Full-width content
- Hamburger menu visible
- Reduced padding (px-4)

Tablet (768px - 1024px):
- 2-column grid for features
- Reduced spacing

Desktop (> 1024px):
- 3-column grid for features
- Horizontal step layout
- Full navigation visible
- Maximum spacing
```

---

## Theme Support

### Dark Mode Implementation
```jsx
// Using className with dark: prefix
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

### Toggle Function
```jsx
const { isDark, toggleTheme } = useTheme()

// Updates:
// 1. isDark state
// 2. HTML document class
// 3. localStorage preference
```

---

## Smooth Scrolling

### Implementation
```jsx
// In App.jsx - ScrollToSection component
useEffect(() => {
  if (location.hash) {
    const element = document.querySelector(location.hash)
    element?.scrollIntoView({ behavior: 'smooth' })
  }
}, [location])
```

### Usage
```html
<a href="#features">Features</a>
<section id="features">...</section>
```

---

## Performance Optimizations

1. **CSS-based animations** instead of JavaScript
2. **No external images** (text-based mockup)
3. **Minimal re-renders** (no unnecessary state)
4. **Tailwind CSS** (production-ready CSS)
5. **No heavy libraries** (Tailwind only)

---

## Customization Examples

### Change Primary Color
```jsx
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#yourcolor'
    }
  }
}
```

### Add New Feature
```jsx
features.push({
  icon: '🎯',
  title: 'New Feature',
  description: 'Feature description here'
})
```

### Modify CTA Text
```jsx
<Link to="/register">
  Your Custom Text →
</Link>
```

---

## Browser Compatibility

✅ Chrome/Edge 88+
✅ Firefox 87+
✅ Safari 14+
✅ iOS Safari 14+
✅ Chrome Mobile

---

## Testing Checklist

- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark/light mode toggle works
- [ ] All links navigate correctly
- [ ] Smooth scroll to sections works
- [ ] Hamburger menu opens/closes
- [ ] Authentication state displays correctly
- [ ] Hover effects work
- [ ] Images/icons load
- [ ] Footer links work
- [ ] Cross-browser testing
