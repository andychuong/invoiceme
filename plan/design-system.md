# InvoiceMe Design System

## 1. Overview

This document defines the design system for InvoiceMe, including colors, typography, spacing, components, and design principles.

## 2. Brand Identity

### 2.1 Logo
- **Primary Logo**: See `logo.svg` and `logo.png`
- **Logo Variations**: 
  - Full logo (with text)
  - Icon only (for favicon/app icons)
  - Dark mode variant
  - Light mode variant

### 2.2 Brand Colors
- **Primary**: Blue (#2563EB) - Trust, professionalism
- **Secondary**: Green (#10B981) - Success, money
- **Accent**: Orange (#F59E0B) - Attention, warnings
- **Neutral**: Gray scale for text and backgrounds

### 2.3 Brand Personality
- **Professional**: Clean, business-focused
- **Modern**: Contemporary design patterns
- **Trustworthy**: Reliable, secure
- **Efficient**: Streamlined workflows

## 3. Color Palette

### 3.1 Primary Colors

#### Blue (Primary)
- **Blue 50**: `#EFF6FF` - Light backgrounds
- **Blue 100**: `#DBEAFE` - Subtle highlights
- **Blue 200**: `#BFDBFE` - Borders
- **Blue 300**: `#93C5FD` - Hover states
- **Blue 400**: `#60A5FA` - Secondary actions
- **Blue 500**: `#2563EB` - Primary actions, links
- **Blue 600**: `#1D4ED8` - Hover states
- **Blue 700**: `#1E40AF` - Active states
- **Blue 800**: `#1E3A8A` - Dark mode primary
- **Blue 900**: `#1E3A8A` - Dark backgrounds

#### Green (Success)
- **Green 50**: `#F0FDF4` - Success backgrounds
- **Green 100**: `#DCFCE7` - Success highlights
- **Green 500**: `#10B981` - Success states, paid status
- **Green 600**: `#059669` - Success hover
- **Green 700**: `#047857` - Success active

#### Orange (Warning/Attention)
- **Orange 50**: `#FFFBEB` - Warning backgrounds
- **Orange 100**: `#FEF3C7` - Warning highlights
- **Orange 500**: `#F59E0B` - Warning states, draft status
- **Orange 600**: `#D97706` - Warning hover

#### Red (Error/Danger)
- **Red 50**: `#FEF2F2` - Error backgrounds
- **Red 100**: `#FEE2E2` - Error highlights
- **Red 500**: `#EF4444` - Error states, delete actions
- **Red 600**: `#DC2626` - Error hover

### 3.2 Neutral Colors

#### Gray Scale
- **Gray 50**: `#F9FAFB` - Light backgrounds
- **Gray 100**: `#F3F4F6` - Subtle backgrounds
- **Gray 200**: `#E5E7EB` - Borders, dividers
- **Gray 300**: `#D1D5DB` - Disabled states
- **Gray 400**: `#9CA3AF` - Placeholder text
- **Gray 500**: `#6B7280` - Secondary text
- **Gray 600**: `#4B5563` - Body text
- **Gray 700**: `#374151` - Headings
- **Gray 800**: `#1F2937` - Dark text
- **Gray 900**: `#111827` - Darkest text

### 3.3 Semantic Colors

#### Status Colors
- **Draft**: Orange 500 (`#F59E0B`)
- **Sent**: Blue 500 (`#2563EB`)
- **Paid**: Green 500 (`#10B981`)
- **Overdue**: Red 500 (`#EF4444`)

#### Action Colors
- **Primary Action**: Blue 500 (`#2563EB`)
- **Success Action**: Green 500 (`#10B981`)
- **Warning Action**: Orange 500 (`#F59E0B`)
- **Danger Action**: Red 500 (`#EF4444`)
- **Neutral Action**: Gray 600 (`#4B5563`)

## 4. Typography

### 4.1 Font Family

#### Primary Font
- **Font Family**: `Inter` (or system font stack)
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Usage**: Body text, UI elements

#### Monospace Font
- **Font Family**: `JetBrains Mono` or `Fira Code`
- **Usage**: Code, invoice numbers, amounts

### 4.2 Font Sizes

#### Scale
- **xs**: `0.75rem` (12px) - Labels, captions
- **sm**: `0.875rem` (14px) - Small text, helper text
- **base**: `1rem` (16px) - Body text (default)
- **lg**: `1.125rem` (18px) - Large body text
- **xl**: `1.25rem` (20px) - Small headings
- **2xl**: `1.5rem` (24px) - Section headings
- **3xl**: `1.875rem` (30px) - Page headings
- **4xl**: `2.25rem` (36px) - Hero headings

### 4.3 Font Weights
- **Light**: 300
- **Regular**: 400 (default)
- **Medium**: 500 (emphasis)
- **Semibold**: 600 (headings)
- **Bold**: 700 (strong emphasis)

### 4.4 Line Heights
- **Tight**: 1.25 (headings)
- **Normal**: 1.5 (body text)
- **Relaxed**: 1.75 (long-form content)

## 5. Spacing

### 5.1 Spacing Scale
- **0**: `0px`
- **1**: `0.25rem` (4px)
- **2**: `0.5rem` (8px)
- **3**: `0.75rem` (12px)
- **4**: `1rem` (16px)
- **5**: `1.25rem` (20px)
- **6**: `1.5rem` (24px)
- **8**: `2rem` (32px)
- **10**: `2.5rem` (40px)
- **12**: `3rem` (48px)
- **16**: `4rem` (64px)
- **20**: `5rem` (80px)
- **24**: `6rem` (96px)

### 5.2 Usage Guidelines
- **Padding**: Use 4, 6, 8 for component padding
- **Margins**: Use 4, 6, 8, 12 for component spacing
- **Gaps**: Use 2, 4, 6 for flex/grid gaps

## 6. Border Radius

### 6.1 Radius Scale
- **none**: `0px`
- **sm**: `0.125rem` (2px)
- **base**: `0.25rem` (4px)
- **md**: `0.375rem` (6px)
- **lg**: `0.5rem` (8px)
- **xl**: `0.75rem` (12px)
- **2xl**: `1rem` (16px)
- **full**: `9999px` (pills, circles)

### 6.2 Usage
- **Buttons**: `md` (6px)
- **Inputs**: `md` (6px)
- **Cards**: `lg` (8px)
- **Modals**: `xl` (12px)
- **Badges**: `full` (pills)

## 7. Shadows

### 7.1 Shadow Scale
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **base**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### 7.2 Usage
- **Cards**: `base` or `md`
- **Modals**: `lg` or `xl`
- **Buttons (hover)**: `md`
- **Dropdowns**: `lg`

## 8. Components

### 8.1 Buttons

#### Primary Button
- **Background**: Blue 500
- **Text**: White
- **Hover**: Blue 600
- **Active**: Blue 700
- **Padding**: `px-4 py-2`
- **Border Radius**: `md` (6px)
- **Font Weight**: Medium (500)

#### Secondary Button
- **Background**: Gray 100
- **Text**: Gray 700
- **Hover**: Gray 200
- **Border**: Gray 200
- **Padding**: `px-4 py-2`
- **Border Radius**: `md` (6px)

#### Danger Button
- **Background**: Red 500
- **Text**: White
- **Hover**: Red 600
- **Padding**: `px-4 py-2`
- **Border Radius**: `md` (6px)

#### Ghost Button
- **Background**: Transparent
- **Text**: Gray 700
- **Hover**: Gray 100
- **Padding**: `px-4 py-2`
- **Border Radius**: `md` (6px)

### 8.2 Inputs

#### Text Input
- **Border**: Gray 200
- **Border Radius**: `md` (6px)
- **Padding**: `px-3 py-2`
- **Focus**: Blue 500 border, ring
- **Error**: Red 500 border
- **Disabled**: Gray 100 background, Gray 400 text

#### Select
- Same styling as text input
- **Dropdown Arrow**: Gray 400

#### Textarea
- Same styling as text input
- **Min Height**: `80px`

### 8.3 Cards

#### Default Card
- **Background**: White
- **Border**: Gray 200
- **Border Radius**: `lg` (8px)
- **Padding**: `p-6`
- **Shadow**: `base` or `md`

#### Invoice Card
- Same as default card
- **Status Badge**: Color-coded (Draft/Sent/Paid)
- **Amount**: Large, bold
- **Balance**: Highlighted if not paid

### 8.4 Tables

#### Table Header
- **Background**: Gray 50
- **Text**: Gray 700
- **Font Weight**: Semibold (600)
- **Padding**: `px-6 py-3`
- **Border Bottom**: Gray 200

#### Table Row
- **Background**: White
- **Hover**: Gray 50
- **Padding**: `px-6 py-4`
- **Border Bottom**: Gray 100

#### Table Cell
- **Text**: Gray 600
- **Padding**: `px-6 py-4`

### 8.5 Badges

#### Status Badge
- **Draft**: Orange 100 background, Orange 700 text
- **Sent**: Blue 100 background, Blue 700 text
- **Paid**: Green 100 background, Green 700 text
- **Padding**: `px-2 py-1`
- **Border Radius**: `full` (pill)
- **Font Size**: `xs` (12px)
- **Font Weight**: Medium (500)

### 8.6 Modals/Dialogs

#### Modal Container
- **Background**: White
- **Border Radius**: `xl` (12px)
- **Shadow**: `xl`
- **Max Width**: `500px` (default), `800px` (large)
- **Padding**: `p-6`

#### Modal Header
- **Font Size**: `2xl` (24px)
- **Font Weight**: Semibold (600)
- **Margin Bottom**: `mb-4`

#### Modal Footer
- **Padding Top**: `pt-4`
- **Border Top**: Gray 200
- **Button Spacing**: `gap-2`

## 9. Layout

### 9.1 Container
- **Max Width**: `1280px` (xl breakpoint)
- **Padding**: `px-4` (mobile), `px-6` (desktop)
- **Margin**: Auto (centered)

### 9.2 Grid System
- **Columns**: 12-column grid
- **Gap**: `gap-4` or `gap-6`
- **Responsive**: Breakpoints (sm, md, lg, xl)

### 9.3 Breakpoints
- **sm**: `640px` (mobile)
- **md**: `768px` (tablet)
- **lg**: `1024px` (desktop)
- **xl**: `1280px` (large desktop)
- **2xl**: `1536px` (extra large)

## 10. Icons

### 10.1 Icon Library
- **Library**: Lucide React (recommended for shadcn/ui)
- **Size**: `16px` (small), `20px` (default), `24px` (large)
- **Color**: Inherit from text color or use semantic colors

### 10.2 Common Icons
- **Plus**: Add/Create
- **Edit**: Update/Modify
- **Trash**: Delete
- **Check**: Success/Complete
- **X**: Close/Cancel
- **Search**: Search/Filter
- **Filter**: Filter options
- **Download**: Export
- **File**: Invoice/Document
- **Dollar**: Payment/Money
- **User**: Customer
- **Calendar**: Date

## 11. Animations

### 11.1 Transitions
- **Duration**: `150ms` (fast), `200ms` (default), `300ms` (slow)
- **Easing**: `ease-in-out` (default)
- **Properties**: All (color, background, transform, opacity)

### 11.2 Hover Effects
- **Buttons**: Slight scale (1.02) or color change
- **Cards**: Shadow increase
- **Links**: Underline or color change

### 11.3 Loading States
- **Spinner**: Rotating animation
- **Skeleton**: Pulse animation
- **Progress**: Linear animation

## 12. Dark Mode

### 12.1 Color Adjustments
- **Background**: Gray 900 (dark), Gray 800 (cards)
- **Text**: Gray 100 (primary), Gray 300 (secondary)
- **Borders**: Gray 700
- **Primary**: Blue 400 (lighter for contrast)

### 12.2 Component Adjustments
- All components should support dark mode
- Use CSS variables for theme switching
- Test contrast ratios for accessibility

## 13. Accessibility

### 13.1 Color Contrast
- **Text on Background**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1 (WCAG AA)
- **Interactive Elements**: Minimum 3:1 (WCAG AA)

### 13.2 Focus States
- **Focus Ring**: Blue 500, 2px width
- **Focus Visible**: Always show on keyboard navigation
- **Tab Order**: Logical flow

### 13.3 ARIA Labels
- All interactive elements should have ARIA labels
- Form inputs should have labels
- Buttons should have descriptive text or ARIA labels

## 14. shadcn/ui Component Mapping

### 14.1 Available Components
- **Button**: Primary, secondary, ghost, destructive variants
- **Input**: Text, email, password, number
- **Select**: Dropdown select
- **Textarea**: Multi-line input
- **Card**: Container with header, content, footer
- **Table**: Data tables with sorting
- **Dialog**: Modal dialogs
- **Alert**: Success, error, warning messages
- **Badge**: Status indicators
- **Avatar**: User/customer images
- **Dropdown Menu**: Context menus
- **Form**: Form components with validation
- **Label**: Form labels
- **Separator**: Dividers
- **Skeleton**: Loading placeholders
- **Toast**: Notifications

### 14.2 Customization
- All shadcn/ui components are customizable
- Components live in `src/components/ui/`
- Modify components as needed for brand consistency

## 15. Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        success: {
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

## 16. Usage Examples

### 16.1 Invoice Status Badge
```tsx
<Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'SENT' ? 'default' : 'warning'}>
  {invoice.status}
</Badge>
```

### 16.2 Primary Button
```tsx
<Button variant="default" size="default">
  Create Invoice
</Button>
```

### 16.3 Invoice Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Invoice #{invoice.number}</CardTitle>
    <Badge>{invoice.status}</Badge>
  </CardHeader>
  <CardContent>
    <p>Customer: {invoice.customerName}</p>
    <p>Total: ${invoice.totalAmount}</p>
    <p>Balance: ${invoice.balance}</p>
  </CardContent>
</Card>
```

