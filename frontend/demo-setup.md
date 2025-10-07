# Demo Setup Instructions

## Quick Start

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

## Customization

### Update GitHub Links
Replace the placeholder GitHub URLs in these files:
- `src/components/Header.tsx` (line 35)
- `src/pages/HomePage.tsx` (line 45, 95)
- `src/pages/OverviewPage.tsx` (line 95)

### Update Domain
Update the base URL in `vite.config.ts` if deploying to a different path.

### Add Your Content
- Edit phase content in `src/data/phases.ts`
- Add your own screenshots to `public/` folder
- Update metadata in `index.html`

## Deployment Options

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to "GitHub Actions"
4. The workflow will automatically deploy

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Features Included

✅ **Interactive Navigation** - Smooth phase navigation with progress tracking  
✅ **Code Syntax Highlighting** - Beautiful code blocks with copy functionality  
✅ **Responsive Design** - Works on all devices  
✅ **Progress Tracking** - Visual completion indicators  
✅ **Modern UI** - Clean, professional design  
✅ **Accessibility** - WCAG compliant  
✅ **Deployment Ready** - Configs for Vercel, Netlify, GitHub Pages  

## Next Steps

1. Customize the content with your specific setup details
2. Add your own screenshots and diagrams
3. Deploy to your preferred platform
4. Share in your portfolio!

---

**Ready to showcase your Pi server expertise! 🚀**
