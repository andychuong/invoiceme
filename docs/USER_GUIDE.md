# InvoiceMe User Guide

Complete user documentation for the InvoiceMe application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Account Management](#account-management)
3. [Customer Management](#customer-management)
4. [Invoice Management](#invoice-management)
5. [Payment Tracking](#payment-tracking)
6. [Company Administration](#company-administration)
7. [Best Practices](#best-practices)
8. [FAQ](#faq)

---

## Getting Started

### Creating Your Account

**Option 1: Start a New Company**
1. Visit https://invoiceme-five.vercel.app
2. Click "Sign Up"
3. Select "Create Company"
4. Fill in your information:
   - Username (unique identifier)
   - Password (minimum 8 characters)
   - Email
   - Display Name (your full name)
   - Company Name
5. Click "Create Company & Sign Up"

You are now the company admin with full access.

**Option 2: Join an Existing Company**
1. Get the company code from your admin
2. Visit https://invoiceme-five.vercel.app
3. Click "Sign Up"
4. Select "Join Company"
5. Fill in your information:
   - Username (unique identifier)
   - Password (minimum 8 characters)
   - Email
   - Display Name (your full name)
   - Company Code (from admin)
6. Click "Join Company & Sign Up"

You are now a team member with access to company data.

### Logging In

1. Visit https://invoiceme-five.vercel.app
2. Click "Sign In"
3. Enter your username/email and password
4. Click "Sign In"

### First Steps After Login

1. **Complete Your Profile**: Click your profile picture (top-right) and add details
2. **Add Your First Customer**: Navigate to Customers > Create Customer
3. **Create Your First Invoice**: Navigate to Invoices > Create Invoice
4. **Customize Company Settings**: (Admin only) Go to Company page to upload logo

---

## Account Management

### Editing Your Profile

1. Click your profile picture in the top-right corner
2. Click "Edit Profile"
3. Update any of the following:
   - Display Name
   - Email
   - Profile Picture
4. Click "Save Changes"

Changes take effect immediately.

### Logging Out

1. Click your profile picture in the top-right corner
2. Click "Logout"

### Changing Your Password

Password reset functionality coming soon. Contact your admin for assistance.

---

## Customer Management

### Creating a Customer

1. Navigate to "Customers" page
2. Click "Create Customer" button (top-right or center)
3. Fill in customer information:
   - **Name** (required): Company or individual name
   - **Email** (required): Primary contact email
   - **Phone**: Contact phone number
   - **Address**: Full billing address
4. Click "Create Customer"

The customer will appear in your customer list immediately.

### Viewing Customer Details

1. Navigate to "Customers" page
2. Click on any customer name

You'll see:
- Contact information
- List of all invoices for this customer
- Total outstanding balance
- Recent activity
- Quick actions (Create Invoice, Edit Customer)

### Editing a Customer

1. Navigate to the customer detail page
2. Click "Edit Customer"
3. Update any information
4. Click "Save Changes"

### Deleting a Customer

Currently, customers cannot be deleted if they have associated invoices. Contact your admin for data management.

### Searching for Customers

1. Navigate to "Customers" page
2. Use the search bar to find customers by:
   - Name
   - Email
   - Phone

---

## Invoice Management

### Creating an Invoice

**From Customer Page:**
1. Navigate to customer detail page
2. Click "Create Invoice"

**From Invoices Page:**
1. Navigate to "Invoices"
2. Click "Create Invoice"
3. Select a customer from the dropdown

**Invoice Form:**
1. **Basic Information**:
   - Invoice Number (auto-generated, can be customized)
   - Customer (if not pre-selected)
   - Issue Date (defaults to today)
   - Due Date (set payment terms)

2. **Line Items**:
   - Click "Add Item"
   - Description: Service or product description
   - Quantity: Number of units
   - Unit Price: Price per unit
   - Subtotal: Calculated automatically
   - Add multiple items as needed

3. **Additional Details**:
   - Notes: Payment terms, thank you message, etc.
   - Tax: Add as line item if needed

4. Click "Create Invoice"

### Invoice States

Invoices can be in one of four states:

1. **Draft**: Work in progress, not yet sent
2. **Sent**: Invoice has been sent to customer
3. **Paid**: Payment received in full
4. **Overdue**: Past due date and not paid

### Viewing Invoices

**List View:**
1. Navigate to "Invoices" page
2. See all company invoices with:
   - Invoice number
   - Customer name
   - Total amount
   - Status
   - Due date

**Detail View:**
1. Click on any invoice
2. See complete invoice details
3. Access actions: Edit, Send, Record Payment, Delete

### Editing an Invoice

1. Navigate to invoice detail page
2. Click "Edit Invoice"
3. Update any information
4. Click "Save Changes"

Note: You can only edit Draft invoices. Sent invoices should be credited and re-issued.

### Sending an Invoice

1. Navigate to invoice detail page
2. Click "Send Invoice"
3. Status changes to "Sent"

Email integration coming soon. Currently, download and send manually.

### Deleting an Invoice

1. Navigate to invoice detail page
2. Click "Delete Invoice"
3. Confirm deletion

Warning: This action cannot be undone.

---

## Payment Tracking

### Recording a Payment

1. Navigate to invoice detail page
2. Click "Record Payment"
3. Fill in payment details:
   - **Amount**: Payment amount (can be partial)
   - **Payment Date**: When payment was received
   - **Payment Method**: Bank Transfer, Credit Card, Cash, etc.
   - **Notes**: Reference number or additional details
4. Click "Record Payment"

The invoice balance updates automatically.

### Partial Payments

InvoiceMe supports partial payments:
1. Record payment for partial amount
2. Outstanding balance is calculated
3. Record additional payments as received
4. Invoice marked "Paid" when balance reaches zero

### Viewing Payment History

**For a Specific Invoice:**
1. Navigate to invoice detail page
2. Scroll to "Payment History" section
3. See all payments for this invoice

**For All Payments:**
1. Navigate to "Payments" page
2. See all payments across all invoices

### Payment Dashboard

Navigate to "Payments" page to see:
- **Total Revenue**: All-time revenue
- **Outstanding Balance**: Total unpaid invoices
- **Recent Payments**: Latest payment activity
- **Payment Trends**: Visual charts (coming soon)

---

## Company Administration

### Admin vs Member Roles

**Admin (Company Creator):**
- Full access to all features
- Manage company settings
- Upload company logo
- Manage team members
- Generate/regenerate company code
- Remove users

**Member (Team Member):**
- Create and manage customers
- Create and manage invoices
- Record payments
- View all company data
- Edit own profile

### Managing Company Settings

**Accessing Company Page:**
1. Navigate to "Company" (admin only)
2. View company overview

**Uploading Company Logo:**
1. Click "Upload Logo"
2. Select image file (PNG, JPG, or SVG)
3. Logo appears throughout the application

**Changing Company Name:**
1. Click "Edit" next to company name
2. Enter new name
3. Click "Save"
4. Name updates everywhere

### Managing Team Members

**Viewing Team:**
1. Navigate to "Company" page
2. Scroll to "Team Members" section
3. See all users with their roles

**Inviting New Members:**
1. Share the Company Code with new team members
2. They sign up using "Join Company" flow
3. They appear in your team list automatically

**Copying Company Code:**
1. Navigate to "Company" page
2. Click "Copy" next to Company Code
3. Share via email, chat, etc.

**Regenerating Company Code:**

Use this feature if your code has been leaked or compromised.

1. Navigate to "Company" page
2. Click "Regenerate Code"
3. Read the warning
4. Confirm regeneration
5. New code is generated
6. Old code is invalidated
7. Share new code with future team members

Important: Existing team members are NOT affected.

**Removing Team Members:**

Use this to revoke access for former employees or contractors.

1. Navigate to "Company" page
2. Find the user in "Team Members" list
3. Click "Remove"
4. Confirm removal
5. User loses access immediately

Important: This action cannot be undone.

---

## Best Practices

### Invoice Numbering

- Use consistent format (e.g., INV-001, INV-002)
- Include year for clarity (e.g., INV-2025-001)
- Don't skip numbers
- Keep sequential order

### Payment Terms

Common payment terms:
- Net 7: Payment due in 7 days
- Net 15: Payment due in 15 days
- Net 30: Payment due in 30 days
- Due on Receipt: Payment due immediately

### Professional Invoice Notes

Include in your invoice notes:
- Payment methods accepted
- Late payment fees (if applicable)
- Thank you message
- Contact information for questions

Example:
```
Payment is due within 30 days of invoice date.
We accept bank transfers, credit cards, and checks.
Thank you for your business!

Questions? Contact us at billing@yourcompany.com
```

### Customer Data Management

- Keep customer information up to date
- Include full addresses for legal compliance
- Verify email addresses before sending invoices
- Add notes about customer preferences

### Team Collaboration

- Assign clear responsibilities (who creates invoices, who tracks payments)
- Regular communication about outstanding invoices
- Weekly review of payment dashboard
- Document your processes

### Security Best Practices

- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Don't share your personal account
- Use company code carefully
- Regenerate company code if leaked
- Remove users immediately when they leave
- Log out from shared computers

---

## FAQ

### General

**Q: Is InvoiceMe free?**
A: Currently in beta and free to use. Pricing details coming soon.

**Q: Can I use InvoiceMe on mobile?**
A: Yes, InvoiceMe is responsive and works on all devices.

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption and security practices.

**Q: Can I export my data?**
A: Data export features are on our roadmap.

### Accounts & Access

**Q: Can I change my username?**
A: Username changes are not currently supported. Contact support for assistance.

**Q: I forgot my password. What do I do?**
A: Password reset is coming soon. Contact your admin for help.

**Q: Can I be part of multiple companies?**
A: Not currently. Each account belongs to one company.

**Q: How do I delete my account?**
A: Contact your admin or support for account deletion.

### Customers & Invoices

**Q: Can I delete a customer?**
A: Customers with invoices cannot be deleted to maintain data integrity.

**Q: What if I sent an invoice with an error?**
A: Edit if still in Draft. For Sent invoices, create a credit note and new invoice.

**Q: Can I customize invoice templates?**
A: Template customization is on our roadmap.

**Q: How do I handle taxes?**
A: Add tax as a line item on your invoice.

**Q: Can I add my logo to invoices?**
A: Yes, upload your company logo in the Company settings (admin only).

### Payments

**Q: Does InvoiceMe process payments?**
A: No, InvoiceMe is for tracking only. Payment processing may come in the future.

**Q: Can I accept payments through the app?**
A: Not currently. Record payments manually after receiving them.

**Q: What if a customer pays too much?**
A: Record the exact amount received and handle refunds outside the system.

**Q: How do I handle refunds?**
A: Create a credit note invoice with negative amounts.

### Company & Team

**Q: Can I transfer admin rights?**
A: Admin transfer is not currently supported.

**Q: How many team members can I have?**
A: Unlimited team members.

**Q: What happens to data when a user is removed?**
A: Their created invoices and data remain. They just lose access.

**Q: Can I have multiple admins?**
A: Currently only the company creator is admin.

### Technical

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, and Edge (latest versions).

**Q: Do I need to install anything?**
A: No, InvoiceMe is a web application. Just use your browser.

**Q: What if the site is down?**
A: Check our status page or contact support.

**Q: Can I integrate InvoiceMe with my accounting software?**
A: API and integrations are on our roadmap.

---

## Getting Help

### Support Channels

1. **Documentation**: Check this guide and other docs
2. **Demo Guide**: See [DEMO_GUIDE.md](./DEMO_GUIDE.md) for feature walkthroughs
3. **GitHub Issues**: Report bugs or request features
4. **Contact Support**: Email support (coming soon)

### Reporting Issues

When reporting issues, include:
- What you were trying to do
- What happened instead
- Screenshots (if applicable)
- Browser and device information
- Steps to reproduce

### Feature Requests

We love feedback! To request features:
1. Check if it's already on the roadmap
2. Create a GitHub issue
3. Describe the feature and use case
4. Explain why it would be valuable

---

## Quick Reference

### Keyboard Shortcuts

Coming soon.

### Common Actions

| Action | Path |
|--------|------|
| Create Customer | Customers > Create Customer |
| Create Invoice | Invoices > Create Invoice |
| Record Payment | Invoice Detail > Record Payment |
| Upload Logo | Company > Upload Logo |
| Edit Profile | Profile Picture > Edit Profile |
| Copy Company Code | Company > Copy button |

### Invoice States

| State | Meaning |
|-------|---------|
| Draft | Not yet sent |
| Sent | Sent to customer |
| Paid | Payment received |
| Overdue | Past due date |

---

**Version**: 1.0
**Last Updated**: November 9, 2025
**Application URL**: https://invoiceme-five.vercel.app

