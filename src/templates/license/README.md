# License Email Templates Documentation

This directory contains email templates for license-related communications. All templates follow a consistent design pattern with RTL (right-to-left) support for Persian/Farsi language.

## Templates Overview

### 1. `payment-order.html`
**Purpose:** Payment order information email - notifies users about their order payment details.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{firstName}}` - User's first name
- `{{orderId}}` - Order ID/identifier
- `{{productName}}` - Name of the product being purchased
- `{{priceCurrency}}` - Original price currency (e.g., USD, EUR)
- `{{priceAmount}}` - Original price amount
- `{{payCurrency}}` - Payment currency (e.g., BTC, ETH, USDT)
- `{{payAmount}}` - Payment amount in payment currency
- `{{payAddress}}` - Wallet address for payment
- `{{expirationText}}` - Payment expiration date/time text
- `{{currentYear}}` - Current year

---

### 2. `inventory-apology.html`
**Purpose:** Apology email when inventory is insufficient - notifies users that active accounts are not available and will be sent within 48 hours.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{firstName}}` - User's first name
- `{{licenseName}}` - Name of the license being waited for
- `{{currentYear}}` - Current year

---

### 3. `ticket-response.html`
**Purpose:** Ticket response notification - notifies users that their ticket has been answered by an agent.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{firstName}}` - User's first name
- `{{ticketNumber}}` - Ticket number/ID
- `{{ticketSubject}}` - Ticket subject
- `{{responseDate}}` - Date when the ticket was answered
- `{{panelUrl}}` - URL to the user panel to view the response
- `{{agentName}}` - Name of the agent who responded
- `{{agentRole}}` - Role/position of the agent
- `{{currentYear}}` - Current year

---

### 4. `license-activation.html`
**Purpose:** License activation confirmation - confirms successful license activation for paid users.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{licenseInfo}}` - License information (displayed in textarea)
- `{{invoiceUrl}}` - URL to download invoice
- `{{currentYear}}` - Current year

---

### 5. `campaign.html`
**Purpose:** Campaign/marketing email template - for sending promotional or informational campaigns.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{firstName}}` - User's first name
- `{{subject}}` - Email subject/title
- `{{content}}` - HTML content of the campaign (rendered as HTML)
- `{{currentYear}}` - Current year

---

### 6. `message-response.html`
**Purpose:** Message response notification - notifies users about responses to their messages.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{firstName}}` - User's first name
- `{{originalMessage}}` - Original message content
- `{{originalMessageDate}}` - Date of original message
- `{{response}}` - Response content (rendered as HTML)
- `{{responderName}}` - Name of the person who responded
- `{{responderRole}}` - Role of the responder
- `{{currentYear}}` - Current year

---

### 7. `welcome.html`
**Purpose:** Welcome email - sent to new users upon account creation.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{firstName}}` - User's first name
- `{{email}}` - User's email address
- `{{currentYear}}` - Current year

---

### 8. `otp-email.html`
**Purpose:** OTP (One-Time Password) email - sends verification code to users.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{title}}` - Email title
- `{{subject}}` - Email subject
- `{{message}}` - Message content
- `{{otpCode}}` - OTP verification code
- `{{currentYear}}` - Current year

---

### 9. `password-reset.html`
**Purpose:** Password reset email - sends password reset link to users.

**Input Variables:**
- `{{companyName}}` - Company name
- `{{email}}` - User's email address
- `{{resetUrl}}` - Password reset URL/link
- `{{currentYear}}` - Current year

---

## Design Features

All templates share the following design characteristics:

- **RTL Support:** Right-to-left layout for Persian/Farsi
- **Responsive Design:** Mobile-friendly with media queries
- **Consistent Styling:** Purple/blue gradient theme
- **Modern UI:** Clean, professional design with gradient backgrounds
- **Typography:** Vazirmatn font family for Persian text
- **Color Scheme:** Purple (#667eea) to violet (#764ba2) gradient background

## Usage Notes

- All templates use handlebars-style variable syntax: `{{variableName}}`
- HTML content variables (like `{{content}}` in campaign.html) are rendered as HTML
- All templates include a footer with company name and copyright
- Templates are designed to work in email clients that support HTML and CSS

