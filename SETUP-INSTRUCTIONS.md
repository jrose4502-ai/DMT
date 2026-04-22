# Digital Marketrix Website - Setup Instructions

## 📋 Quick Start

### 1. Save the Logo
Save your logo image as `digitalmarketrix-logo.png` in the `website/public/` folder.
- The logo should be a transparent PNG
- Recommended dimensions: 400x400px or similar square aspect ratio
- The navbar will automatically resize it

### 2. Install Dependencies (if needed)
If npm is available, you can optionally install react-router-dom:
```bash
cd website
npm install
```

### 3. Run the Development Server
```bash
cd website
npm start
```

The website will open at `http://localhost:3000`

## 📁 Project Structure

```
website/
├── public/
│   ├── digitalmarketrix-logo.png     <- Place your logo here
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js        <- Navigation with logo
│   │   ├── Hero.js          <- Hero section
│   │   ├── About.js         <- About section with founders
│   │   ├── Services.js      <- Services grid
│   │   ├── Contact.js       <- Contact form
│   │   ├── Footer.js        <- Footer
│   │   └── ScrollToTop.js   <- Scroll to top button
│   ├── styles/
│   │   ├── Navbar.css
│   │   ├── Hero.css
│   │   ├── About.css
│   │   ├── Services.css
│   │   ├── Contact.css
│   │   ├── Footer.css
│   │   └── ScrollToTop.css
│   ├── App.js               <- Main app with all components imported
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## ✨ Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **Interactive Animations** - Smooth scroll, fade-ins, hover effects
- ✅ **Logo Integration** - Your logo in the navbar with hover effects
- ✅ **Contact Form** - Functional with validation
- ✅ **Animated Counters** - Stats that count up when scrolled into view
- ✅ **Smooth Navigation** - Scroll to sections smoothly
- ✅ **Mobile Menu** - Hamburger menu for mobile devices
- ✅ **Scroll to Top Button** - Appears when scrolling down

## 📝 Business Information Included

- **Company**: Digital Marketrix
- **Location**: Los Angeles, California
- **Founders**: Julian Rosario & Angie Rosso
- **Phone**: (559) 874-8874
- **Email**: info@digitalmarketrix.com

## 🎨 Customization

All styles are in separate CSS files in the `src/styles/` folder. You can easily customize:
- Colors (currently purple/gradient theme)
- Fonts
- Spacing
- Animations

## 🚀 Deployment

When ready to deploy:
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📱 Sections

1. **Hero** - Eye-catching landing with gradient background
2. **About** - Company info with founder cards and animated stats
3. **Services** - 6 service cards with hover details
4. **Contact** - Contact form and info cards
5. **Footer** - Links and social media

Enjoy your new website! 🎉

