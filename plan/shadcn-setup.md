# shadcn/ui Setup Guide

## Overview

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Components are copied into your project, so you have full control over the code.

## Installation

### Prerequisites
- Node.js 18+ 
- React 18+ or Next.js 13+
- TypeScript

### Step 1: Initialize Next.js Project

```bash
npx create-next-app@latest invoiceme-frontend --typescript --tailwind --app
cd invoiceme-frontend
```

### Step 2: Install shadcn/ui

```bash
npx shadcn-ui@latest init
```

This will prompt you for:
- **Style**: Default (recommended)
- **Base color**: Slate (recommended)
- **CSS variables**: Yes (recommended)

### Step 3: Configure Tailwind CSS

The init command will update your `tailwind.config.js` with the necessary configuration. Verify it includes:

```javascript
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // shadcn/ui theme configuration
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Step 4: Install Required Components

Install components as needed:

```bash
# Core components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add avatar
```

### Step 5: Install Additional Dependencies

```bash
# Form handling
npm install react-hook-form @hookform/resolvers

# Validation
npm install zod

# Icons (Lucide React - recommended)
npm install lucide-react

# Date handling
npm install date-fns

# HTTP client
npm install axios
```

## Project Structure

After setup, your project should look like:

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── common/          # Custom common components
│   ├── customers/       # Customer-specific components
│   ├── invoices/        # Invoice-specific components
│   └── payments/        # Payment-specific components
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── viewmodels/          # MVVM ViewModels
├── models/              # MVVM Models
├── services/            # API services
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
└── styles/
    └── globals.css      # Global styles
```

## Component Usage Examples

### Button

```tsx
import { Button } from "@/components/ui/button"

// Primary button
<Button>Create Invoice</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Ghost button
<Button variant="ghost">Edit</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Input

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="customer@example.com" />
</div>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

<Card>
  <CardHeader>
    <CardTitle>Invoice #12345</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Customer: Acme Corp</p>
    <p>Total: $1,000.00</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice #</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell>Acme Corp</TableCell>
      <TableCell>$1,000.00</TableCell>
      <TableCell>Paid</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form with Validation

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export function CustomerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="customer@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Badge (Status)

```tsx
import { Badge } from "@/components/ui/badge"

// Status badges
<Badge variant="default">Sent</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Overdue</Badge>
<Badge className="bg-green-500">Paid</Badge>
```

### Toast (Notifications)

```tsx
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export function ToastExample() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Invoice created",
          description: "Invoice #12345 has been created successfully.",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
```

## Customization

### Theme Colors

Edit `app/globals.css` to customize colors:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%; /* Blue */
    --primary-foreground: 210 40% 98%;
    /* ... more colors */
  }
}
```

### Component Customization

All components are in `components/ui/` and can be modified directly. They're your code!

## Best Practices

1. **Install components as needed**: Don't install all components upfront
2. **Customize components**: Modify components in `components/ui/` to match your brand
3. **Use TypeScript**: All components are fully typed
4. **Follow MVVM**: Keep ViewModels separate from UI components
5. **Consistent styling**: Use Tailwind utility classes consistently
6. **Accessibility**: shadcn/ui components are accessible by default (Radix UI)

## Resources

- **shadcn/ui Documentation**: https://ui.shadcn.com/
- **Radix UI Documentation**: https://www.radix-ui.com/
- **Tailwind CSS Documentation**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/

## Common Components for InvoiceMe

### Priority 1 (Essential)
- Button
- Input
- Label
- Card
- Table
- Form
- Dialog

### Priority 2 (Important)
- Select
- Textarea
- Badge
- Alert
- Toast
- Separator

### Priority 3 (Nice to have)
- Dropdown Menu
- Skeleton
- Avatar
- Tabs
- Accordion
- Popover

