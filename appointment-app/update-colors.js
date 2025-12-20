const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Apply all color replacements
const replacements = [
  [/bg-slate-50\b/g, 'bg-background'],
  [/bg-slate-100\b/g, 'bg-muted'],
  [/bg-slate-900\b/g, 'bg-foreground'],
  [/bg-white\b/g, 'bg-card'],
  [/text-slate-900\b/g, 'text-foreground'],
  [/text-slate-800\b/g, 'text-foreground'],
  [/text-slate-700\b/g, 'text-foreground'],
  [/text-slate-600\b/g, 'text-muted-foreground'],
  [/text-slate-500\b/g, 'text-muted-foreground'],
  [/text-slate-400\b/g, 'text-muted-foreground'],
  [/text-slate-300\b/g, 'text-muted-foreground/50'],
  [/bg-brand-600\b/g, 'bg-primary'],
  [/bg-brand-700\b/g, 'bg-primary/90'],
  [/bg-brand-50\b/g, 'bg-primary/10'],
  [/bg-brand-100\b/g, 'bg-primary/20'],
  [/text-brand-600\b/g, 'text-primary'],
  [/text-brand-700\b/g, 'text-primary'],
  [/text-brand-900\b/g, 'text-primary'],
  [/border-slate-100\b/g, 'border-border'],
  [/border-slate-200\b/g, 'border-border'],
  [/border-slate-700\b/g, 'border-border'],
  [/border-brand-100\b/g, 'border-primary/20'],
  [/border-brand-600\b/g, 'border-primary'],
  [/hover:text-brand-600\b/g, 'hover:text-primary'],
  [/hover:bg-brand-500\b/g, 'hover:bg-primary/90'],
  [/hover:bg-brand-700\b/g, 'hover:bg-primary/90'],
  [/hover:border-slate-600\b/g, 'hover:border-muted-foreground'],
  [/hover:border-slate-300\b/g, 'hover:border-muted-foreground'],
  [/hover:bg-slate-100\b/g, 'hover:bg-muted'],
  [/hover:bg-white\b/g, 'hover:bg-card'],
  [/text-white\b/g, 'text-primary-foreground'],
  [/hover:text-slate-600\b/g, 'hover:text-muted-foreground'],
  [/text-indigo-100\b/g, 'text-primary/20'],
  [/bg-indigo-100\b/g, 'bg-primary/10'],
  [/shadow-brand-600\/20\b/g, 'shadow-primary/20'],
  [/shadow-brand-500\/30\b/g, 'shadow-primary/30'],
  [/border-slate-50\b/g, 'border-background'],
  [/border-slate-800\b/g, 'border-foreground/80'],
];

replacements.forEach(([pattern, replacement]) => {
  content = content.replace(pattern, replacement);
});

fs.writeFileSync(filePath, content);
console.log('Color replacements completed successfully!');
