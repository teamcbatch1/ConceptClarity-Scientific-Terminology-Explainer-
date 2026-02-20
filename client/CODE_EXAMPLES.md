# Landing Page - Component Code Examples

## Quick Reference - Copy & Paste

### 1. Import All Components
```jsx
// In App.jsx or any page
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import FeatureCard from './components/FeatureCard'
import Footer from './components/Footer'
```

---

## Individual Component Examples

### Navbar Component
**File**: `src/components/Navbar.jsx`

**Basic Usage**:
```jsx
<Navbar />
```

**What it includes**:
- Logo with gradient text
- Navigation links with smooth scroll
- Dark/Light theme toggle
- Mobile hamburger menu
- Authentication buttons

**Features**:
- Fixed position (sticky to top)
- Responsive (hamburger on mobile)
- Theme toggle with persistence
- Automatic auth display

---

### FeatureCard Component
**File**: `src/components/FeatureCard.jsx`

**Basic Usage**:
```jsx
<FeatureCard
  icon="💬"
  title="AI Chat Assistant"
  description="Ask any FinTech question and get instant, accurate explanations powered by advanced AI."
/>
```

**Props**:
```typescript
interface FeatureCardProps {
  icon: string;        // Emoji or unicode
  title: string;       // Feature name
  description: string; // Feature description
}
```

**Example Grid**:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <FeatureCard icon="💬" title="Chat" description="..." />
  <FeatureCard icon="📚" title="Learn" description="..." />
  <FeatureCard icon="🎯" title="Master" description="..." />
</div>
```

**Styling**:
- Rounded corners with shadow
- Hover effect: scale 105% + lift
- Dark mode support
- Gradient icon background

---

### Footer Component
**File**: `src/components/Footer.jsx`

**Basic Usage**:
```jsx
<Footer />
```

**What it includes**:
- Brand section
- Product links
- Company links
- Legal links
- Social icons
- Contact info

**Features**:
- Dynamic copyright year
- Responsive grid layout
- Link categories
- Contact email

---

### Landing Page
**File**: `src/pages/Landing.jsx`

**Basic Usage**:
```jsx
<Landing />
```

**Sections**:
1. Hero with CTA buttons
2. Features grid (6 cards)
3. How it works (3 steps)
4. About section
5. Final CTA

**Key Props**:
```javascript
// Uses useAuth() to check login state
const { user } = useAuth()

// Shows different buttons based on auth:
// - If logged in: "Go to Chat" button
// - If not: "Get Started" and "Try Demo" buttons
```

---

## Usage Patterns

### Adding a New Feature
```jsx
// In Landing.jsx - update features array
const features = [
  // ... existing features
  {
    icon: '🎯',
    title: 'New Feature',
    description: 'This is my new feature description'
  }
]
```

### Adding a New Step
```jsx
// In Landing.jsx - update steps array
const steps = [
  // ... existing steps
  {
    number: '04',
    title: 'New Step',
    description: 'Describe the step here'
  }
]
```

### Creating Feature Card Outside Landing
```jsx
import FeatureCard from './components/FeatureCard'

function MyComponent() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <FeatureCard
        icon="⚡"
        title="Lightning Fast"
        description="Instant responses to your questions"
      />
      <FeatureCard
        icon="🔒"
        title="Secure"
        description="Enterprise-grade encryption"
      />
      <FeatureCard
        icon="📈"
        title="Growth"
        description="Track your learning progress"
      />
    </div>
  )
}
```

---

## Common Customizations

### Change Button Color
```jsx
// From (gradient primary to secondary):
<Link to="/register" className="bg-gradient-to-r from-primary to-secondary text-white">
  Get Started
</Link>

// To (solid color):
<Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white">
  Get Started
</Link>

// To (outline style):
<Link to="/register" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
  Get Started
</Link>
```

### Change Heading Style
```jsx
// From (gradient text):
<h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  Heading
</h1>

// To (solid color):
<h1 className="text-primary">
  Heading
</h1>

// To (shadow text):
<h1 className="text-white drop-shadow-lg">
  Heading
</h1>
```

### Add New Section
```jsx
// In Landing.jsx, add before closing div:
<section id="my-section" className="py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold mb-8">My Section</h2>
    <p>Content here</p>
  </div>
</section>

// Then add link in Navbar.jsx:
{
  label: 'My Section',
  href: '#my-section'
}
```

### Change Icon
```jsx
// Replace emoji in features:
icon: '💬'  // Current
icon: '🎤'  // Voice
icon: '📸'  // Images
icon: '⚙️'  // Settings
```

---

## Responsive Grid Examples

### 1 Column (Mobile)
```jsx
className="grid grid-cols-1 gap-8"
```

### 2 Columns (Tablet)
```jsx
className="grid grid-cols-2 gap-8"
```

### 3 Columns (Desktop)
```jsx
className="grid grid-cols-3 gap-8"
```

### Responsive 1-2-3
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```

### Responsive 1-3
```jsx
className="grid grid-cols-1 lg:grid-cols-3 gap-8"
```

---

## Dark Mode Patterns

### Text
```jsx
// Light text on light bg, dark text on dark bg
className="text-gray-900 dark:text-white"

// Secondary text
className="text-gray-600 dark:text-gray-400"
```

### Background
```jsx
// White on light, dark on dark
className="bg-white dark:bg-gray-900"

// Slightly lighter/darker
className="bg-gray-50 dark:bg-gray-950"
```

### Borders
```jsx
// Visible in both modes
className="border-gray-300 dark:border-gray-700"
```

### Shadows
```jsx
// Shadow on light, less visible on dark
className="shadow-lg dark:shadow-2xl"
```

---

## Animation Classes

### Hover Effects
```jsx
// Scale up
className="hover:scale-105"

// Translate (lift up)
className="hover:-translate-y-2"

// Shadow enhancement
className="hover:shadow-2xl"

// Combined (used on feature cards)
className="hover:scale-105 hover:shadow-2xl hover:-translate-y-2"

// Transition timing
className="transition-all duration-300"
```

### Color Transitions
```jsx
// Smooth color change on hover
className="text-gray-700 hover:text-primary transition duration-300"

// Background color transition
className="bg-white hover:bg-gray-100 transition duration-300 dark:bg-gray-900 dark:hover:bg-gray-800"
```

---

## Spacing Utilities

### Section Spacing
```jsx
// Vertical padding (top and bottom)
className="py-20"  // 80px (py-4 = 16px, so 20 * 4 = 80px)

// Horizontal padding (left and right)
className="px-4 sm:px-6 lg:px-8"  // Responsive: 16px > 24px > 32px

// Gap between items
className="gap-8"  // 32px
```

### Margin
```jsx
className="mb-4"   // margin-bottom 16px
className="mb-8"   // margin-bottom 32px
className="mt-6"   // margin-top 24px
className="my-12"  // margin vertical 48px
```

---

## Responsive Text Sizing

### Headings
```jsx
// H1 (Hero)
className="text-5xl md:text-6xl"

// H2 (Sections)
className="text-4xl md:text-5xl"

// H3 (Cards)
className="text-2xl"

// Paragraph
className="text-lg md:text-xl"
```

---

## Button Examples

### Primary Button
```jsx
<button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
  Click Me
</button>
```

### Secondary Button
```jsx
<button className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-300 transition-all duration-300">
  Click Me
</button>
```

### Outlined Button
```jsx
<button className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300">
  Click Me
</button>
```

---

## Link Examples

### Navigation Link
```jsx
<Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
  Dashboard
</Link>
```

### Anchor Link (Smooth Scroll)
```jsx
<a href="#features" className="text-primary hover:text-secondary transition font-bold">
  Go to Features
</a>
```

### External Link
```jsx
<a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">
  External Link
</a>
```

---

## Icon/Emoji Reference

**Feature Icons**:
```
💬 Chat
📚 Learning
🤖 AI/Robot
📝 Documents
🔐 Security
🎙️ Voice
⚡ Fast
🔒 Secure
📊 Analytics
🎯 Target
🚀 Launch
💡 Idea
```

**UI Icons** (Using text):
```
☀️ Light mode
🌙 Dark mode
🔔 Notifications
❌ Close
☰ Menu
✓ Check
⚙️ Settings
```

---

## Color Utilities Quick Reference

### Primary Shades
```
primary: #6366f1 (Indigo)
primary-600: darker indigo
primary-400: lighter indigo
primary-100: very light indigo
```

### Dark Mode Shades
```
gray-950: #030712 (Almost black)
gray-900: #111827 (Dark)
gray-800: #1f2937 (Medium dark)
gray-700: #374151 (Less dark)
```

### Light Mode Shades
```
gray-50: #f9fafb (Almost white)
gray-100: #f3f4f6 (Very light)
gray-200: #e5e7eb (Light)
gray-700: #374151 (Dark gray)
```

---

## Performance Tips

### Avoid These
```jsx
// ❌ Inline styles (slower)
style={{ color: 'red' }}

// ❌ Conditional classes (unclear)
className={user ? 'bg-red' : 'bg-blue'}

// ❌ Complex calculations
className={`text-${size * 2}`}
```

### Do This Instead
```jsx
// ✅ Tailwind utilities
className="text-primary"

// ✅ Predefined variants
className={isDark ? 'dark:text-white' : 'text-gray-900'}

// ✅ CSS classes
className="text-lg"
```

---

## Testing Code Snippets

### Check Responsive Design
```javascript
// Open DevTools Console and paste:
console.log({
  mobile: window.innerWidth < 768,
  tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  desktop: window.innerWidth >= 1024
})
```

### Check Dark Mode
```javascript
// In console:
document.documentElement.classList.contains('dark')
localStorage.getItem('theme')
```

### Check All Links
```javascript
// Find all links on page
document.querySelectorAll('a').forEach(link => {
  console.log(link.href, link.textContent)
})
```

---

**Last Updated**: February 7, 2026
**Framework**: React + Tailwind CSS
**Status**: Ready to Use ✅
