#!/usr/bin/env node

/**
 * Simple script to prepare CSS files for CDN
 * Creates csvEditorCss folder with combined and minified CSS
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'csvEditorCss');

// CSS files to combine
const CSS_FILES = [
  'csvEditorHtml/main.css',
  'csvEditorHtml/dark.css',
  'csvEditorHtml/light.css',
  'csvEditorHtml/high_contrast.css',
  'csvEditorHtml/settingsOverwrite.css'
];

// Third-party CSS to copy
const THIRD_PARTY_CSS = [
  { src: 'thirdParty/handsontable/handsontable.min.css', dest: 'handsontable.min.css' },
  { src: 'thirdParty/fortawesome/fontawesome-free/css/all.min.css', dest: 'fontawesome.min.css' }
];

// Simple CSS minification
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around {}:;,
    .trim();
}

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔨 Building CDN CSS files...\n');

// Combine and minify CSV editor CSS files
console.log('📦 Combining CSS files...');
let combinedCSS = '';

CSS_FILES.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    combinedCSS += `\n/* ${path.basename(file)} */\n${content}\n`;
    console.log(`  ✓ Added ${path.basename(file)}`);
  } else {
    console.log(`  ✗ Not found: ${file}`);
  }
});

console.log('\n⚡ Minifying CSS...');
const minifiedCSS = minifyCSS(combinedCSS);
const outputFile = path.join(OUTPUT_DIR, 'index.min.css');
fs.writeFileSync(outputFile, minifiedCSS);
const sizeKB = (minifiedCSS.length / 1024).toFixed(2);
console.log(`  ✓ Created main-cdn.min.css (${sizeKB} KB)\n`);

// Copy third-party CSS files
console.log('📋 Copying third-party CSS...');
THIRD_PARTY_CSS.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(OUTPUT_DIR, dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    const stats = fs.statSync(destPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  ✓ Copied ${dest} (${sizeKB} KB)`);
  } else {
    console.log(`  ✗ Not found: ${src}`);
  }
});

console.log('\n✅ Done! Files created in csvEditorCss/');

