# InvoiceMe Design Assets

## Logo Files

### 1. Full Logo (with text)
- **File**: `logo-full.svg`
- **Usage**: Header, landing pages, marketing materials
- **Dimensions**: 300x80px (scalable)
- **Format**: SVG (vector)

### 2. Icon Only
- **File**: `logo-icon.svg`
- **Usage**: Favicon, app icons, small spaces
- **Dimensions**: 64x64px (scalable)
- **Format**: SVG (vector)

### 3. Square Logo
- **File**: `logo.svg`
- **Usage**: Social media, square formats
- **Dimensions**: 200x200px (scalable)
- **Format**: SVG (vector)

## Logo Variations

### Color Variations
- **Light Background**: Use default logo (dark text)
- **Dark Background**: Use inverted logo (white text)
- **Single Color**: Use monochrome version for print

### Size Guidelines
- **Large**: 300px width (full logo)
- **Medium**: 200px width (full logo)
- **Small**: 100px width (icon only)
- **Favicon**: 32x32px (icon only)

## Logo Usage Guidelines

### Do's
- ✅ Maintain minimum clear space (20% of logo height)
- ✅ Use SVG format for web
- ✅ Scale proportionally
- ✅ Use on light or dark backgrounds with sufficient contrast

### Don'ts
- ❌ Don't stretch or distort the logo
- ❌ Don't change colors (except for dark mode)
- ❌ Don't rotate the logo
- ❌ Don't place on busy backgrounds
- ❌ Don't use below minimum size (64px for icon)

## Color Palette

### Primary Colors
- **Blue 500**: `#2563EB` - Primary brand color
- **Blue 600**: `#1D4ED8` - Hover states
- **Blue 700**: `#1E40AF` - Active states

### Accent Colors
- **Green 500**: `#10B981` - Success, paid status
- **Orange 500**: `#F59E0B` - Warning, draft status
- **Red 500**: `#EF4444` - Error, danger actions

### Neutral Colors
- **Gray 50**: `#F9FAFB` - Light backgrounds
- **Gray 600**: `#4B5563` - Body text
- **Gray 900**: `#111827` - Headings, dark text

## Typography

### Primary Font
- **Font**: Inter
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Usage**: Body text, UI elements

### Logo Font
- **Font**: Inter (Bold 700)
- **Usage**: Logo text "InvoiceMe"

## Icon Library

### Recommended Library
- **Library**: Lucide React
- **Installation**: `npm install lucide-react`
- **Usage**: Consistent with shadcn/ui components

### Common Icons
- **Plus**: Add/Create actions
- **Edit**: Edit/Update actions
- **Trash**: Delete actions
- **Check**: Success/Complete
- **X**: Close/Cancel
- **Search**: Search functionality
- **Filter**: Filter options
- **FileText**: Invoice/Document
- **DollarSign**: Payment/Money
- **User**: Customer
- **Calendar**: Date picker

## Design Resources

### Tools
- **Figma**: Design mockups (if needed)
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **Lucide Icons**: Icon library

### Design Files Location
```
design-assets/
├── logo.svg
├── logo-full.svg
├── logo-icon.svg
├── favicon.ico (to be generated)
└── app-icons/ (to be generated)
```

## Implementation Notes

### Next.js Setup
1. Place logo files in `public/` directory
2. Use `<Image>` component for optimized loading
3. Generate favicon from `logo-icon.svg`

### React Setup
1. Place logo files in `src/assets/` or `public/`
2. Import as SVG or use as image source
3. Generate favicon from `logo-icon.svg`

### Favicon Generation
- Use `logo-icon.svg` as source
- Generate multiple sizes: 16x16, 32x32, 48x48, 64x64
- Create `favicon.ico` with multiple sizes
- Add to `public/` directory

## Brand Guidelines Summary

1. **Primary Color**: Blue (#2563EB)
2. **Logo**: Document icon with dollar sign and checkmark
3. **Typography**: Inter font family
4. **Style**: Modern, professional, clean
5. **Tone**: Trustworthy, efficient, professional

## Quick Reference

### Logo Colors
- **Document**: Blue (#2563EB)
- **Dollar Sign**: Green (#10B981)
- **Checkmark**: Green (#10B981)
- **Text**: Dark Gray (#111827)

### Status Colors
- **Draft**: Orange (#F59E0B)
- **Sent**: Blue (#2563EB)
- **Paid**: Green (#10B981)
- **Overdue**: Red (#EF4444)

