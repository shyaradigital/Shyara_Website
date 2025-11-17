# ✦ Shyara Website – Developer Onboarding & Architecture Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure Breakdown](#3-repository-structure-breakdown)
4. [Routing Overview](#4-routing-overview)
5. [Component Architecture](#5-component-architecture)
6. [Data Flow & Logic](#6-data-flow--logic)
7. [Installation & Setup Guide](#7-installation--setup-guide)
8. [Development Workflow](#8-development-workflow)
9. [How to Add New Features](#9-how-to-add-new-features)
10. [Deployment Guide](#10-deployment-guide)
11. [Debugging & Common Issues](#11-debugging--common-issues)
12. [Future Improvements](#12-future-improvements-optional)

---

## 1. Project Overview

### Purpose of the Website

**Shyara Digital Solutions** is a full-stack web application that serves as the official website and service platform for Shyara Digital, a digital marketing and development agency. The website provides:

- **Service Showcase**: Display of digital services including Social Media Management, Website Development, App Development, Video Editing, Ad Campaign Management, and Festive Post Designs
- **E-commerce Functionality**: Shopping cart system for service purchases with a 50% advance payment model
- **Portfolio Display**: Interactive portfolio gallery showcasing past work across different service categories
- **Client Communication**: Contact forms integrated with EmailJS for lead generation
- **Responsive Design**: Fully responsive website optimized for desktop, tablet, and mobile devices

### Core Technologies Used

- **Frontend**: React 19.1.0 with React Router DOM 6.23.0
- **Backend**: Node.js with Express 4.18.2
- **Styling**: Custom CSS with CSS Variables and inline styles
- **Email Service**: EmailJS for contact form submissions
- **Icons**: Lucide React for iconography
- **Animations**: AOS (Animate On Scroll) library
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Deployment**: Docker support with multi-stage builds

---

## 2. Tech Stack

### Frameworks

- **React 19.1.0**: Modern React with hooks and functional components
- **Express.js 4.18.2**: Minimal Node.js web framework for backend API

### Libraries

#### Frontend Dependencies
- **react-router-dom 6.23.0**: Client-side routing with HashRouter
- **lucide-react 0.525.0**: Modern icon library
- **aos 2.3.4**: Animate On Scroll library for scroll animations
- **@emailjs/browser 4.4.1**: EmailJS client library for sending emails

#### Backend Dependencies
- **express 4.18.2**: Web server framework

#### Development Tools
- **react-scripts 5.0.1**: Build tooling and development server
- **sharp 0.34.5**: Image optimization (WebP conversion)
- **fluent-ffmpeg 2.1.3**: Video optimization
- **ffmpeg-static 5.2.0**: Static FFmpeg binary
- **fast-glob 3.3.3**: Fast file globbing for media optimization script
- **fs-extra 11.3.2**: Enhanced file system operations
- **ora 5.4.1**: Terminal spinners for CLI feedback

### UI/UX Tools

- **Custom CSS**: No CSS framework; uses custom CSS with CSS variables
- **Inline Styles**: React inline styles for dynamic styling
- **Custom Fonts**: 
  - Salena font family (multiple weights and styles)
  - Davigo font (demo version)
- **Responsive Design**: Breakpoint-based responsive components (768px mobile, 1024px tablet)

### State Management

- **React Context API**: `CartContext` for global cart state management
- **Local Storage**: Persistent cart storage and form data persistence
- **React Hooks**: useState, useEffect, useContext for component state

### Build/Deployment Tools

- **Create React App**: Standard React build configuration
- **Docker**: Multi-stage Docker builds for production
- **Docker Compose**: Container orchestration
- **Nginx**: Reverse proxy configuration (optional)
- **Node.js 18**: Runtime environment (Alpine Linux in Docker)

---

## 3. Repository Structure Breakdown

### Root Directory

```
Website/
├── backend/              # Node.js Express server
├── frontend/             # React application
├── scripts/              # Utility scripts
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Multi-stage Docker build
├── nginx.conf            # Nginx reverse proxy config
├── package.json          # Root package.json (media optimization)
└── start-local.ps1       # PowerShell script for local development
```

### Backend Directory (`backend/`)

**Purpose**: Express.js server that serves the React build and handles API routes.

**Key Files**:
- **`server.js`**: Main Express server file
  - Serves static files from `frontend/build` (production) or `frontend/public` (development)
  - Handles SPA routing (all routes serve `index.html`)
  - API endpoint: `/api/contact` (POST) for contact form submissions
  - Optimized media serving from `pics-optimized` directory
  - Port: 3000 (configurable via `PORT` environment variable)

- **`package.json`**: Backend dependencies and scripts
  - Dependencies: `express`
  - Script: `npm start` runs `server.js`

### Frontend Directory (`frontend/`)

**Purpose**: React single-page application (SPA) with all UI components and pages.

#### `frontend/src/` - Source Code

**`App.js`**: Main application component
- Sets up React Router with HashRouter
- Defines all routes and their corresponding components
- Wraps app with `CartProvider` for global cart state
- Includes 404 Not Found handler

**`index.js`**: Application entry point
- Renders React app to DOM
- Registers service worker for PWA functionality
- Suppresses WebGL console errors

**`style.css`**: Global stylesheet
- Custom font-face declarations (Salena, Davigo)
- CSS variables for theming (`--color-primary`, `--color-text-primary`, etc.)
- Global reset and base styles
- Component-specific styles
- Responsive breakpoints and media queries

**`index.css`**: Additional global styles (if any)

#### `frontend/src/components/` - Reusable Components

**`Layout.js`**: Main layout wrapper component
- Provides consistent header, navigation, and footer across pages
- Responsive navigation (desktop horizontal nav, mobile bottom nav)
- Sticky header on scroll (desktop)
- Auto-hide/show mobile navbar on scroll
- Cart icon with item count badge
- Sign-in button linking to dashboard
- Footer with social media links and copyright

**`ResponsiveHome.js`**: Responsive home page wrapper
- Detects screen size (mobile/tablet/desktop)
- Renders appropriate version: `Home.js`, `HomeTablet.js`, or `HomeMobile.js`

**`ResponsiveAbout.js`**: Responsive about page wrapper
- Similar to ResponsiveHome, renders `About.js`, `AboutTablet.js`, or `AboutMobile.js`

**`AnimatedHeading.js`**: Animated text component
- Typewriter effect for headings
- Respects `prefers-reduced-motion` for accessibility
- Uses `FancyText` for styling

**`FancyText.js`**: Styled text component
- Applies primary color and custom font weight to text

**`LoadingScreen.js`**: Loading screen component (if used)

**`TermsAndConditions.js`**: Terms and conditions modal/component

**`EmailJSTest.js`**: EmailJS testing component (development)

**Font Directories**:
- `salena-font/`: Salena font family files (multiple weights/styles)
- `davigo-font/`: Davigo font files

#### `frontend/src/pages/` - Page Components

**Main Pages**:
- **`Home.js`**: Desktop home page
- **`HomeTablet.js`**: Tablet-optimized home page
- **`HomeMobile.js`**: Mobile-optimized home page
- **`HomeNoLoading.js`**: Home page without loading screen
- **`About.js`**: Desktop about page
- **`AboutTablet.js`**: Tablet about page
- **`AboutMobile.js`**: Mobile about page
- **`Services.js`**: Main services listing page
- **`Portfolio.js`**: Portfolio gallery with lazy loading and image optimization
- **`Contact.js`**: Contact form page with EmailJS integration
- **`ContactTest.js`**: Contact form testing page
- **`Terms.js`**: Terms and conditions page

**E-commerce Pages**:
- **`Cart.js`**: Shopping cart page
  - Displays cart items with quantity controls
  - Shows 50% discount information
  - Celebration modal for first-time cart users
  - Calculates totals (fixed-price items only)
  
- **`Checkout.js`**: Checkout form page
  - Customer information form (persisted in localStorage)
  - Address collection
  - Terms & conditions agreement
  - Validates form before proceeding to payment
  
- **`Payment.js`**: Payment processing page
  - Payment gateway integration (if implemented)
  - Order summary display

**Service Detail Pages** (`frontend/src/pages/services/`):
- **`SocialMediaManagementPage.js`**: SMM service details
- **`FestivePostsPage.js`**: Festive posts service details
- **`AdsCampaignManagementPage.js`**: Ad campaign service details
- **`WebsiteDevelopmentPage.js`**: Website development service details
- **`AppDevelopmentPage.js`**: App development service details
- **`VideoEditingReelsPage.js`**: Video editing service details
- **`PersonalizedServicesPage.js`**: Custom/personalized services page

**Other Pages**:
- **`ClientLoginPage.js`**: Client login/dashboard access page
- **`AddItemsPage.js`**: Admin page for adding items (if used)

#### `frontend/src/context/` - React Context

**`CartContext.js`**: Global cart state management
- **State**: `cart` array, `notification`, `showCelebration`
- **Functions**:
  - `addToCart(item)`: Adds item to cart with 50% discount logic
  - `removeFromCart(id)`: Removes item from cart
  - `updateQuantity(id, quantity)`: Updates item quantity
  - `updateCartItem(id, updates)`: Updates cart item properties
  - `clearCart()`: Empties cart
  - `showNotification(message, type)`: Shows toast notification
  - `showCelebration()`: Shows 50% advance payment celebration modal
- **Persistence**: Cart saved to localStorage
- **Service Type Conflict Detection**: Prevents adding multiple items from same service type
- **Pricing Logic**: Automatically applies 50% discount (except custom quotes)

#### `frontend/src/services/` - Service Modules

**`emailService.js`**: EmailJS integration
- **Configuration**: EmailJS service ID, template ID, public key
- **Function**: `sendContactForm(formData)` - Sends contact form emails
- **Error Handling**: Comprehensive error messages for different failure scenarios

**`README.md`**: Service documentation

#### `frontend/public/` - Static Assets

**Purpose**: Public assets served directly without processing.

**Key Directories**:
- **`pics/`**: Original images and videos
  - `ads/`: Advertisement samples
  - `App Dev/`: App development portfolio samples
  - `Festive Posts/`: Festive post designs
  - `Reels/`: Video reel samples
  - `SMM/`: Social media management samples
  - Logo and branding images

- **`pics-optimized/`**: Optimized media (generated by script)
  - WebP images (converted from PNG/JPG)
  - Optimized videos (MP4)
  - Same directory structure as `pics/`

- **`mockups/`**: HTML mockup files (sample websites)

**Key Files**:
- **`index.html`**: HTML template (React app mounts here)
- **`manifest.json`**: PWA manifest configuration
- **`robots.txt`**: SEO robots file
- **`sw.js`**: Service worker for PWA functionality
- **`_redirects`**: Netlify redirects file (SPA routing)
- **`web.config`**: IIS/web server configuration
- **`favicon.ico`**: Site favicon
- **`gradient.png`**: Background gradient image

### Scripts Directory (`scripts/`)

**`optimize-media.js`**: Media optimization script
- Converts images to WebP format using Sharp
- Optimizes videos using FFmpeg
- Maintains directory structure
- Skips already optimized files (checks modification time)
- Usage: `npm run optimize-media` (from root)

### Configuration Files

**`Dockerfile`**: Multi-stage Docker build
- Stage 1: Build React app (Node 18 Alpine)
- Stage 2: Production server (Node 18 Alpine)
- Copies built frontend to backend directory
- Runs as non-root user for security
- Health check included

**`docker-compose.yml`**: Docker Compose configuration
- Defines `shyara-app` service
- Port mapping: 3000:3000
- Environment variables
- Health check configuration
- Auto-restart policy

**`nginx.conf`**: Nginx reverse proxy configuration
- Proxies requests to Node.js server (port 3000)
- Handles static file serving
- API route proxying
- HTTPS configuration template (commented)

**`start-local.ps1`**: PowerShell script for local development
- Builds frontend
- Installs dependencies if needed
- Starts backend server
- Windows-specific

---

## 4. Routing Overview

### Routing System

The application uses **React Router DOM v6** with **HashRouter** (routes prefixed with `#`).

**Router Setup** (`App.js`):
```javascript
<HashRouter>
  <CartProvider>
    <Routes>
      {/* All routes defined here */}
    </Routes>
  </CartProvider>
</HashRouter>
```

### Route Map

#### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ResponsiveHome` | Home page (responsive) |
| `/home-alt` | `HomeNoLoading` | Alternative home page without loading |
| `/about` | `ResponsiveAbout` | About page (responsive) |
| `/services` | `Services` | Services listing page |
| `/portfolio` | `Portfolio` | Portfolio gallery |
| `/contact` | `Contact` | Contact form page |
| `/terms` | `TermsPage` | Terms and conditions |

#### Service Detail Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/services/social-media-management` | `SocialMediaManagementPage` | SMM service details |
| `/services/festive-posts` | `FestivePostsPage` | Festive posts service |
| `/services/ads-campaign-management` | `AdsCampaignManagementPage` | Ad campaigns service |
| `/services/website-development` | `WebsiteDevelopmentPage` | Website development service |
| `/services/app-development` | `AppDevelopmentPage` | App development service |
| `/services/video-editing-reels` | `VideoEditingReelsPage` | Video editing service |
| `/services/personalized` | `PersonalizedServicesPage` | Custom services page |

#### E-commerce Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/cart` | `Cart` | Shopping cart |
| `/checkout` | `Checkout` | Checkout form |
| `/payment` | `Payment` | Payment processing |

#### Other Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/client-login` | `ClientLoginPage` | Client dashboard login |
| `/add-items` | `AddItemsPage` | Admin item management |
| `*` | `NotFound` | 404 error page |

### Navigation Flow

1. **Home** → Services/Portfolio/About/Contact
2. **Services** → Individual Service Pages → Add to Cart
3. **Cart** → Checkout → Payment
4. **Portfolio** → View samples by service category
5. **Contact** → Submit form → EmailJS sends email

### Layout Structure

All routes (except `/terms`) are wrapped in the `Layout` component, which provides:
- Header with logo and navigation
- Mobile-responsive navigation
- Footer with social links
- Consistent background and styling

### Dynamic Routes

Currently, all routes are static. No dynamic route parameters are used.

### HashRouter vs BrowserRouter

The app uses **HashRouter** (`#/route`) instead of BrowserRouter (`/route`) because:
- Works without server-side routing configuration
- Easier deployment on static hosting
- No need for server rewrites for SPA routing

---

## 5. Component Architecture

### Component Hierarchy

```
App
├── CartProvider (Context)
│   └── Router
│       └── Routes
│           ├── Layout (wraps most routes)
│           │   ├── Header
│           │   │   ├── Logo
│           │   │   ├── Navigation (Desktop)
│           │   │   ├── Cart Icon
│           │   │   └── Sign In Button
│           │   ├── Mobile Navbar
│           │   ├── {children} (Page Content)
│           │   └── Footer
│           └── TermsPage (no Layout)
```

### Reusable Components

#### `Layout.js`
**Purpose**: Consistent page wrapper with header, nav, and footer.

**Props**: `children` (React node)

**Features**:
- Responsive header (sticky on desktop, auto-hide on mobile)
- Cart context integration (shows cart count)
- Mobile bottom navigation
- Footer with social links

**Usage**:
```jsx
<Layout>
  <YourPageContent />
</Layout>
```

#### `ResponsiveHome.js` & `ResponsiveAbout.js`
**Purpose**: Device detection and conditional rendering.

**Logic**:
- Detects screen width on mount and resize
- Renders appropriate component:
  - Mobile (≤768px): Mobile version
  - Tablet (769-1024px): Tablet version
  - Desktop (>1024px): Desktop version

#### `AnimatedHeading.js`
**Purpose**: Animated heading with typewriter effect.

**Props**:
- `text` (string): Text to display
- `as` (string): HTML tag (default: 'h1')
- `style` (object): Additional styles
- `className` (string): CSS class
- `ariaLabel` (string): Accessibility label

**Features**:
- Typewriter animation
- Respects `prefers-reduced-motion`
- Uses `FancyText` for styling

#### `FancyText.js`
**Purpose**: Styled text with primary color.

**Props**:
- `text` (string): Text content
- `weight` (number): Font weight (default: 600)

#### `LoadingScreen.js`
**Purpose**: Loading screen component (if implemented).

### Layout Components

#### `Layout.js` (Main Layout)
- **Header**: Logo, navigation, cart, sign-in
- **Mobile Nav**: Bottom navigation bar (mobile only)
- **Footer**: Copyright, terms link, social icons

### Props/State Flows

#### Cart State Flow
```
CartContext (Provider)
  ↓
Pages/Components (Consumers)
  ↓
addToCart(item) → Updates Context → localStorage → UI Updates
```

#### Form Data Flow
```
Contact/Checkout Forms
  ↓
Local State (useState)
  ↓
EmailJS API / Navigation State
```

#### Responsive Component Flow
```
ResponsiveHome/About
  ↓
Window Resize Listener
  ↓
State Update (deviceType)
  ↓
Conditional Render (Home/HomeTablet/HomeMobile)
```

### Styling Methodology

#### 1. **Custom CSS** (`style.css`)
- Global styles, CSS variables, font declarations
- Component classes (`.service-card`, `.navbar-center`, etc.)
- Responsive media queries

#### 2. **Inline Styles** (React)
- Dynamic styles based on state/props
- Hover effects, animations
- Component-specific styling

#### 3. **CSS Variables**
```css
:root {
  --color-primary: #bb6aff;
  --color-text-primary: #e7e7e7;
  --color-text-secondary: #bdbdbd;
}
```

#### 4. **Responsive Breakpoints**
- Mobile: ≤768px
- Tablet: 769px - 1024px
- Desktop: >1024px

#### 5. **No CSS Framework**
- No Tailwind, Bootstrap, or Material-UI
- Pure custom CSS and inline styles
- Custom animations and transitions

---

## 6. Data Flow & Logic

### Data Flow Overview

```
User Interaction
  ↓
Component Event Handler
  ↓
State Update / Context Update
  ↓
API Call (if needed) / localStorage
  ↓
UI Re-render
```

### Cart Data Flow

1. **Add to Cart**:
   ```
   User clicks "Add to Cart"
   → addToCart(item) called
   → CartContext checks for service type conflicts
   → Applies 50% discount (if not custom quote)
   → Updates cart state
   → Saves to localStorage
   → Shows notification
   → UI updates (cart count, cart page)
   ```

2. **Cart Persistence**:
   - Cart stored in `localStorage` as JSON
   - Automatically loaded on app mount
   - Persists across page refreshes

3. **Service Type Conflict Logic**:
   - Each service has a type (SMM, Web Dev, App Dev, etc.)
   - Only one item per service type allowed in cart
   - Prevents duplicate service purchases

### Contact Form Data Flow

1. **Form Submission**:
   ```
   User fills contact form
   → Form validation (required fields, email format, phone format)
   → Check if cart has items (shows alert if yes)
   → emailService.sendContactForm(formData)
   → EmailJS API call
   → Success/Error notification
   → Form reset (on success)
   ```

2. **EmailJS Integration**:
   - Service ID: `service_xxbj3sv`
   - Template ID: `template_l1wo2lg`
   - Public Key: `61WpC-MTI2cvq-BE_`
   - Sends email to Shyara team with form data

### Checkout Data Flow

1. **Form Persistence**:
   - Checkout form data saved to `localStorage`
   - Persists if user navigates away and returns
   - Cleared after successful payment

2. **Validation**:
   - Required fields: name, email, phone, address, city, state, zip
   - Terms & conditions agreement required
   - Redirects to payment page on success

### Portfolio Data Flow

1. **Image Optimization**:
   - Portfolio uses optimized images from `pics-optimized/`
   - Falls back to original images if optimized not available
   - Lazy loading with Intersection Observer

2. **Media Prefetching**:
   - Prefetches first 6 images on load
   - Progressive loading for remaining images
   - Supports both images and videos

### APIs Used

#### Backend API (`/api/contact`)
- **Method**: POST
- **Body**: `{ name, email, message }`
- **Response**: `{ success: true }` or `{ error: "message" }`
- **Purpose**: Contact form submission (currently logs to console)

#### EmailJS API (Frontend)
- **Service**: EmailJS browser SDK
- **Function**: `emailService.sendContactForm(formData)`
- **Purpose**: Sends contact form emails directly from browser

### Local/Global State

#### Global State (Context)
- **Cart**: `CartContext` - Cart items, notifications, celebration modal

#### Local State (Components)
- **Forms**: Contact, Checkout forms use `useState`
- **UI State**: Modals, dropdowns, hover states
- **Responsive State**: Device type detection

#### Persistent State (localStorage)
- **Cart**: `'cart'` - Cart items JSON
- **Checkout Form**: `'checkoutFormData'` - Form data JSON
- **Celebration Modal**: `'hasSeenCelebration'` - Boolean

---

## 7. Installation & Setup Guide

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Git**: For cloning the repository
- **Docker** (optional): For containerized deployment

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/shyaradigital/Shyara_Website.git
cd Shyara_Website
```

#### 2. Install Root Dependencies (for media optimization)

```bash
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

#### 4. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

#### 5. Optimize Media Assets (Optional but Recommended)

```bash
npm run optimize-media
```

This converts images to WebP and optimizes videos. The script:
- Reads from `frontend/public/pics/`
- Outputs to `frontend/public/pics-optimized/`
- Skips already optimized files

#### 6. Environment Variables

**Frontend**: No environment variables required (EmailJS keys are hardcoded in `emailService.js`).

**Backend**: Optional environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (default: development)

Create `.env` file in `backend/` if needed:
```
PORT=3000
NODE_ENV=development
```

#### 7. Build Frontend (for production)

```bash
cd frontend
npm run build
cd ..
```

This creates `frontend/build/` directory with production-ready files.

#### 8. Start Development Server

**Option A: Manual Start**

Terminal 1 (Frontend - Development):
```bash
cd frontend
npm start
```
Runs on `http://localhost:3000` (or next available port)

Terminal 2 (Backend - Production Build):
```bash
cd backend
npm start
```
Serves built frontend on `http://localhost:3000`

**Option B: PowerShell Script (Windows)**

```powershell
.\start-local.ps1
```

This script:
- Builds frontend
- Installs dependencies if needed
- Starts backend server

**Option C: Docker**

```bash
docker-compose up --build
```

### Required Node Version

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js 18)

### Required Dependencies

See `package.json` files:
- **Root**: Media optimization tools
- **Frontend**: React, React Router, EmailJS, Lucide Icons, AOS
- **Backend**: Express

### Commands Reference

#### Frontend Commands (`frontend/` directory)
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

#### Backend Commands (`backend/` directory)
```bash
npm start          # Start Express server
```

#### Root Commands (root directory)
```bash
npm run optimize-media    # Optimize images and videos
```

#### Docker Commands
```bash
docker-compose up          # Start containers
docker-compose up --build  # Rebuild and start
docker-compose down        # Stop containers
docker-compose logs        # View logs
```

---

## 8. Development Workflow

### Coding Conventions

#### JavaScript/React
- **Functional Components**: Use functional components with hooks
- **Arrow Functions**: Prefer arrow functions for component definitions
- **const/let**: Use `const` by default, `let` when reassignment needed
- **Template Literals**: Use template literals for string concatenation
- **Destructuring**: Destructure props and state objects
- **Early Returns**: Use early returns for conditionals

#### File Naming
- **Components**: PascalCase (e.g., `ResponsiveHome.js`)
- **Pages**: PascalCase (e.g., `Services.js`)
- **Utilities**: camelCase (e.g., `emailService.js`)
- **Constants**: UPPER_SNAKE_CASE (if used)

#### Component Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Component Definition
const MyComponent = () => {
  // 3. Hooks
  const [state, setState] = useState();
  const navigate = useNavigate();
  
  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 5. Event Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### Naming Conventions

- **Components**: PascalCase (`ResponsiveHome`, `CartContext`)
- **Functions**: camelCase (`addToCart`, `handleSubmit`)
- **Variables**: camelCase (`cartItems`, `isMobile`)
- **Constants**: UPPER_SNAKE_CASE (if global constants)
- **CSS Classes**: kebab-case (`.service-card`, `.navbar-center`)
- **Files**: Match component/function name

### How Components Should Be Added

1. **Create Component File**:
   - Location: `frontend/src/components/` or `frontend/src/pages/`
   - Naming: PascalCase matching component name

2. **Import Dependencies**:
   - React hooks
   - React Router hooks (if needed)
   - Context (if needed)
   - Other components

3. **Define Component**:
   - Functional component with hooks
   - Follow component structure above

4. **Export Component**:
   - Default export: `export default ComponentName`

5. **Add to Routes** (if it's a page):
   - Import in `App.js`
   - Add `<Route>` in `<Routes>`

6. **Use in Other Components** (if reusable):
   - Import where needed
   - Use as JSX element

### How Pages Should Be Structured

1. **Page Component**:
   - Located in `frontend/src/pages/`
   - Wrapped in `<Layout>` (unless it's Terms page)

2. **Responsive Pages** (if needed):
   - Create separate files: `Page.js`, `PageTablet.js`, `PageMobile.js`
   - Create wrapper: `ResponsivePage.js` (like `ResponsiveHome.js`)
   - Use wrapper in routes

3. **Page Structure**:
   ```javascript
   const MyPage = () => {
     // State and hooks
     
     return (
       <div style={{ /* page container styles */ }}>
         {/* Page content */}
       </div>
     );
   };
   ```

### UI/UX Standards to Follow

#### Color Scheme
- **Primary**: `#bb6aff` / `#a259f7` (Purple)
- **Text Primary**: `#e7e7e7` (Light gray)
- **Text Secondary**: `#bdbdbd` (Medium gray)
- **Background**: Dark theme (black/dark gray)

#### Typography
- **Font Family**: Salena (custom), fallback to system fonts
- **Headings**: Bold, large size, primary color
- **Body**: Regular weight, readable size

#### Spacing
- Consistent padding/margins
- Use rem/em units for scalability

#### Responsive Design
- Mobile-first approach (optional, but recommended)
- Breakpoints: 768px (mobile), 1024px (tablet)
- Test on all screen sizes

#### Accessibility
- Use semantic HTML
- Add `aria-label` for icons/buttons
- Keyboard navigation support
- Respect `prefers-reduced-motion`

#### Animations
- Smooth transitions (0.2s - 0.4s)
- Use CSS transitions or React state-based animations
- Avoid excessive animations

#### Buttons
- Clear hover states
- Consistent styling
- Loading states for async actions

---

## 9. How to Add New Features

### Adding a New Page

#### Step 1: Create Page Component

Create `frontend/src/pages/NewPage.js`:
```javascript
import React from 'react';
import Layout from '../components/Layout';

const NewPage = () => {
  return (
    <Layout>
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        <h1>New Page</h1>
        {/* Page content */}
      </div>
    </Layout>
  );
};

export default NewPage;
```

#### Step 2: Add Route

Edit `frontend/src/App.js`:
```javascript
import NewPage from './pages/NewPage';

// In Routes:
<Route path="/new-page" element={<Layout><NewPage /></Layout>} />
```

#### Step 3: Add Navigation Link (Optional)

Edit `frontend/src/components/Layout.js`:
```javascript
<Link to="/new-page" className={location.pathname === '/new-page' ? 'active' : ''}>
  New Page
</Link>
```

### Adding a New Service Page

#### Step 1: Create Service Page

Create `frontend/src/pages/services/NewServicePage.js`:
```javascript
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import FancyText from '../../components/FancyText';

const NewServicePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
    addToCart({
      id: 'new-service-id',
      name: 'New Service',
      price: 10000,
      // ... other properties
    });
  };
  
  return (
    <div className="service-page-container">
      {/* Service page content */}
    </div>
  );
};

export default NewServicePage;
```

#### Step 2: Add Route

Edit `frontend/src/App.js`:
```javascript
import NewServicePage from './pages/services/NewServicePage';

<Route path="/services/new-service" element={<Layout><NewServicePage /></Layout>} />
```

#### Step 3: Add to Services Listing (Optional)

Edit `frontend/src/pages/Services.js`:
```javascript
const services = [
  // ... existing services
  {
    icon: <YourIcon />,
    title: 'New Service',
    desc: 'Service description',
    price: '₹10,000',
    route: '/services/new-service',
    basePrice: 10000,
  },
];
```

### Adding a New Component

#### Step 1: Create Component File

Create `frontend/src/components/NewComponent.js`:
```javascript
import React from 'react';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default NewComponent;
```

#### Step 2: Use Component

Import and use in pages/components:
```javascript
import NewComponent from '../components/NewComponent';

// In JSX:
<NewComponent prop1="value1" prop2="value2" />
```

### Adding a New API Endpoint

#### Step 1: Add Route in Backend

Edit `backend/server.js`:
```javascript
app.post('/api/new-endpoint', (req, res) => {
  const { data } = req.body;
  // Handle request
  res.json({ success: true, data: result });
});
```

#### Step 2: Call from Frontend

Create service function or call directly:
```javascript
const response = await fetch('/api/new-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'value' }),
});
const result = await response.json();
```

### Maintaining Consistency

1. **Follow Existing Patterns**:
   - Look at similar components/pages
   - Use same structure and styling approach

2. **Reuse Components**:
   - Use `Layout`, `AnimatedHeading`, `FancyText` where applicable
   - Don't duplicate code

3. **Consistent Styling**:
   - Use CSS variables for colors
   - Follow existing spacing patterns
   - Match button/input styles

4. **Responsive Design**:
   - Test on mobile, tablet, desktop
   - Use responsive wrapper if needed

5. **Cart Integration**:
   - Use `CartContext` for cart operations
   - Follow existing cart item structure

---

## 10. Deployment Guide

### Build Steps

#### 1. Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

This creates `frontend/build/` with:
- `index.html`
- `static/` (JS, CSS, images)
- Other assets

#### 2. Verify Build

```bash
ls -la frontend/build
# Should show index.html and static/ directory
```

### Final Output Folder

- **Production Build**: `frontend/build/`
- **Server Serves**: `frontend/build/` (or `frontend/public/` in development)

### Deployment Options

#### Option 1: Docker Deployment (Recommended)

**Build Docker Image**:
```bash
docker build -t shyara-website .
```

**Run Container**:
```bash
docker run -p 3000:3000 -e PORT=3000 shyara-website
```

**Using Docker Compose**:
```bash
docker-compose up -d --build
```

**Environment Variables** (if needed):
```bash
docker run -p 3000:3000 -e PORT=3000 -e NODE_ENV=production shyara-website
```

#### Option 2: Node.js Direct Deployment

**On Server**:
```bash
# Clone repository
git clone https://github.com/shyaradigital/Shyara_Website.git
cd Shyara_Website

# Install dependencies
npm install
cd frontend && npm install && npm run build && cd ..
cd backend && npm install && cd ..

# Start server (with PM2 for production)
pm2 start backend/server.js --name shyara-app
```

**PM2 Configuration**:
```bash
pm2 start backend/server.js --name shyara-app --env production
pm2 save
pm2 startup
```

#### Option 3: Vercel Deployment

1. **Connect Repository** to Vercel
2. **Build Settings**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **Environment Variables**: Add if needed
4. **Deploy**

**Note**: Vercel handles SPA routing automatically with `_redirects` file.

#### Option 4: Netlify Deployment

1. **Connect Repository** to Netlify
2. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. **Deploy**

**Note**: Netlify uses `_redirects` file for SPA routing.

#### Option 5: Traditional Hosting (cPanel, etc.)

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload Files**:
   - Upload `frontend/build/` contents to `public_html/`
   - Or configure server to serve from `build/` directory

3. **Server Configuration**:
   - Use `.htaccess` (Apache) or `web.config` (IIS) for SPA routing
   - Ensure all routes serve `index.html`

### Nginx Reverse Proxy Setup

If using Nginx as reverse proxy:

1. **Copy Configuration**:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/shyara.co.in
   sudo ln -s /etc/nginx/sites-available/shyara.co.in /etc/nginx/sites-enabled/
   ```

2. **Edit Configuration**:
   - Update `server_name` with your domain
   - Configure SSL certificates (if using HTTPS)

3. **Test and Reload**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Environment Variables for Production

**Backend** (`.env` file or environment):
```
NODE_ENV=production
PORT=3000
```

**Frontend**: No environment variables needed (EmailJS keys are in code).

### SSL/HTTPS Setup

1. **Obtain SSL Certificate** (Let's Encrypt, etc.)
2. **Update Nginx Config** (uncomment HTTPS section in `nginx.conf`)
3. **Update Express Server** (if serving HTTPS directly)
4. **Update Frontend** (use HTTPS URLs if needed)

### Post-Deployment Checklist

- [ ] Frontend build completed successfully
- [ ] Server is running and accessible
- [ ] All routes work (test direct links)
- [ ] Static assets load (CSS, JS, images)
- [ ] API endpoints work (`/api/contact`)
- [ ] Contact form sends emails
- [ ] Cart functionality works
- [ ] Mobile responsive design works
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Domain DNS points to server
- [ ] Analytics/tracking added (if needed)

---

## 11. Debugging & Common Issues

### Known Errors and Fixes

#### Issue: "Not Found" on Direct Links

**Symptoms**: Visiting `yoursite.com/services` shows 404.

**Causes**:
- Frontend not built
- Server not serving `index.html` for all routes
- Build directory missing

**Solutions**:
1. Build frontend: `cd frontend && npm run build`
2. Verify `frontend/build/index.html` exists
3. Check server logs for serving path
4. Ensure server.js handles SPA routing (serves index.html for non-API routes)
5. Check `_redirects` file (for Netlify/Vercel)

#### Issue: Cart Not Persisting

**Symptoms**: Cart empties on page refresh.

**Causes**:
- localStorage not working
- CartContext not initializing from localStorage
- Browser blocking localStorage

**Solutions**:
1. Check browser console for localStorage errors
2. Verify `CartContext.js` loads cart from localStorage on mount
3. Check if browser allows localStorage (not in private/incognito mode)
4. Clear browser cache and try again

#### Issue: Images Not Loading

**Symptoms**: Portfolio images or other images don't display.

**Causes**:
- Optimized images not generated
- Incorrect image paths
- CORS issues

**Solutions**:
1. Run `npm run optimize-media` to generate optimized images
2. Check image paths in code (should use `process.env.PUBLIC_URL`)
3. Verify images exist in `frontend/public/pics/` or `pics-optimized/`
4. Check browser console for 404 errors
5. Verify `_redirects` or server config allows image serving

#### Issue: EmailJS Not Sending Emails

**Symptoms**: Contact form shows success but no email received.

**Causes**:
- Invalid EmailJS credentials
- EmailJS service/template not configured
- Network/CORS issues

**Solutions**:
1. Verify EmailJS credentials in `emailService.js`:
   - Service ID: `service_xxbj3sv`
   - Template ID: `template_l1wo2lg`
   - Public Key: `61WpC-MTI2cvq-BE_`
2. Check EmailJS dashboard for service/template configuration
3. Test with `EmailJSTest.js` component
4. Check browser console for EmailJS errors
5. Verify EmailJS script is loaded in `index.html`

#### Issue: Build Fails

**Symptoms**: `npm run build` errors.

**Causes**:
- Missing dependencies
- Syntax errors
- Out of memory

**Solutions**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check for syntax errors in code
4. Increase Node.js memory: `NODE_OPTIONS=--max_old_space_size=4096 npm run build`
5. Check build logs for specific error messages

#### Issue: Port Already in Use

**Symptoms**: Server fails to start, port 3000 in use.

**Solutions**:
1. Change port: `PORT=3001 npm start`
2. Kill process using port:
   ```bash
   # Linux/Mac
   lsof -ti:3000 | xargs kill
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Build Issues

#### Build Takes Too Long

**Solutions**:
- Optimize images before build
- Remove unused dependencies
- Use production build optimizations

#### Build Size Too Large

**Solutions**:
- Run `npm run optimize-media` to optimize images
- Check for large unused dependencies
- Use code splitting (if implemented)
- Enable gzip compression on server

### Routing Mistakes

#### HashRouter vs BrowserRouter

- **Current**: Uses HashRouter (`#/route`)
- **If switching to BrowserRouter**: Need server-side routing configuration
- **Recommendation**: Keep HashRouter for easier deployment

#### Route Not Found

**Solutions**:
1. Check route path in `App.js` matches navigation links
2. Verify route is inside `<Routes>` component
3. Check for typos in route paths
4. Ensure Layout wrapper is correct

### Component Loading Issues

#### Component Not Rendering

**Solutions**:
1. Check import path (case-sensitive)
2. Verify component is exported correctly
3. Check browser console for errors
4. Verify component is added to routes (if it's a page)

#### Styling Not Applied

**Solutions**:
1. Check CSS class names match
2. Verify `style.css` is imported in `App.js` or `index.js`
3. Check for CSS specificity issues
4. Verify inline styles are correct

### Performance Issues

#### Slow Page Load

**Solutions**:
1. Optimize images: `npm run optimize-media`
2. Enable gzip compression on server
3. Use lazy loading (already implemented in Portfolio)
4. Check for large bundle size
5. Use CDN for static assets (if applicable)

#### Memory Leaks

**Solutions**:
1. Clean up event listeners in `useEffect` cleanup
2. Remove unused state and effects
3. Check for infinite loops in effects
4. Use React DevTools Profiler to identify issues

### Debugging Tools

#### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Check API calls and asset loading
- **Application**: Check localStorage, sessionStorage
- **React DevTools**: Inspect component state and props

#### Server Logs
- Check Express server logs for errors
- Check PM2 logs: `pm2 logs shyara-app`
- Check Docker logs: `docker logs <container-name>`

#### Common Console Errors

- **WebGL Errors**: Suppressed in `index.js` (intentional)
- **404 Errors**: Check file paths and server configuration
- **CORS Errors**: Check API endpoint configuration
- **EmailJS Errors**: Check EmailJS credentials and network

---

## 12. Future Improvements (Optional)

### Potential Enhancements

#### 1. **State Management**
- Consider Redux or Zustand for complex state management
- Currently using Context API (sufficient for current needs)

#### 2. **Testing**
- Add unit tests (Jest, React Testing Library)
- Add integration tests for critical flows
- Add E2E tests (Cypress, Playwright)

#### 3. **Performance**
- Implement code splitting for routes
- Add service worker for offline support (partially implemented)
- Implement image lazy loading everywhere (currently only in Portfolio)
- Add skeleton loaders for better UX

#### 4. **SEO**
- Switch to BrowserRouter with server-side rendering (Next.js)
- Add meta tags dynamically
- Implement structured data (JSON-LD)
- Add sitemap.xml

#### 5. **Accessibility**
- Add ARIA labels to all interactive elements
- Improve keyboard navigation
- Add focus indicators
- Test with screen readers

#### 6. **Backend**
- Add database for order management
- Implement user authentication
- Add admin dashboard
- Implement payment gateway integration

#### 7. **Features**
- Add blog/news section
- Add client testimonials section
- Add live chat support
- Add multi-language support (i18n)

#### 8. **DevOps**
- Set up CI/CD pipeline (GitHub Actions, GitLab CI)
- Add automated testing in CI
- Implement staging environment
- Add monitoring and error tracking (Sentry)

#### 9. **UI/UX**
- Add dark/light theme toggle
- Improve mobile navigation UX
- Add loading states for all async operations
- Add success/error toast notifications globally

#### 10. **Code Quality**
- Add ESLint configuration
- Add Prettier for code formatting
- Add TypeScript for type safety
- Implement component documentation (Storybook)

---

## Additional Resources

### Documentation Files in Repository

- **`DEPLOYMENT-GUIDE.md`**: Detailed deployment instructions
- **`README-Docker.md`**: Docker-specific documentation
- **`RENDER-DEPLOYMENT.md`**: Render.com deployment guide
- **`FRONTEND-ONLY-FIX.md`**: Frontend-only deployment fixes
- **`FIX-PORTFOLIO-ROUTING.md`**: Portfolio routing fixes

### External Resources

- **React Documentation**: https://react.dev
- **React Router Documentation**: https://reactrouter.com
- **EmailJS Documentation**: https://www.emailjs.com/docs
- **Express.js Documentation**: https://expressjs.com
- **Docker Documentation**: https://docs.docker.com

### Support

For issues or questions:
- Check existing documentation files
- Review code comments
- Check browser/server console logs
- Contact the development team

---

## Conclusion

This documentation provides a comprehensive overview of the Shyara Website codebase. New developers should:

1. Read this guide thoroughly
2. Set up the development environment
3. Explore the codebase following the structure outlined here
4. Start with small changes to understand the codebase
5. Follow the coding conventions and patterns established

The codebase is well-structured and follows React best practices. With this guide, you should be able to start contributing immediately.

**Happy Coding! 🚀**

---

*Last Updated: 2025*
*Document Version: 1.0*

