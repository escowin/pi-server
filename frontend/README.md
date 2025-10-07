# Pi Server Setup Guide - Interactive Frontend

A modern, interactive frontend showcase for the comprehensive Raspberry Pi server setup guide. This React application transforms technical documentation into an engaging, user-friendly experience.

## 🚀 Features

- **Interactive Navigation**: Smooth navigation between setup phases with progress tracking
- **Code Syntax Highlighting**: Beautiful code blocks with copy-to-clipboard functionality
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progress Tracking**: Visual progress indicators and completion status
- **Modern Tech Stack**: Built with React, TypeScript, Vite, and Tailwind CSS
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Code Highlighting**: Prism.js + react-syntax-highlighter
- **Routing**: React Router DOM
- **Animations**: Framer Motion

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🚀 Deployment

### GitHub Pages
The project is configured for automatic deployment to GitHub Pages:

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch to trigger deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Site header with navigation
│   ├── Sidebar.tsx     # Collapsible sidebar navigation
│   ├── CodeBlock.tsx   # Syntax-highlighted code blocks
│   └── StepCard.tsx    # Individual step cards
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── OverviewPage.tsx # Setup overview
│   └── PhasePage.tsx   # Individual phase pages
├── data/               # Static data
│   └── phases.ts       # Phase definitions and content
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Adding New Phases
1. Update `src/data/phases.ts` with new phase data
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Sidebar.tsx`

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Use Tailwind utility classes for component styling

### Content
- Edit phase content in `src/data/phases.ts`
- Update metadata in `index.html`
- Modify component text in respective files

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- TypeScript for type safety

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme
- Focus indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Raspberry Pi Foundation](https://www.raspberrypi.org/) for the amazing hardware
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Prism.js](https://prismjs.com/) for syntax highlighting

---

**Built with ❤️ for the developer community**
