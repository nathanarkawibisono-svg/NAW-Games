# EmailJS Setup Instructions

## How Booking Information is Received

The website is configured to send booking information via **Email** (primary method) and **WhatsApp** (backup/optional method).

### Current Configuration:
- **Email Destination**: nathan.arka.wibisono@gmail.com
- **WhatsApp Number**: +62 8877050607

## Setting Up EmailJS (Required for Email Functionality)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

### Step 2: Create an Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy your **Service ID** (e.g., `service_xxxxxxx`)

### Step 3: Create an Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

**Subject:**
```
New Booking - {{room_type}} - {{from_name}}
```

**Content:**
```
New Booking Received from NAW Games Website

Customer Information:
- Name: {{from_name}}
- Phone: {{from_phone}}

Booking Details:
- Room Type: {{room_type}}
- Date: {{booking_date}}
- Time: {{booking_time}}
- Duration: {{duration}}
- Total Price: {{total_price}}
- Payment Method: {{payment_method}}

Additional Notes: {{notes}}

---
This is an automated message from NAW Games booking system.
```

4. Set **To Email** field to: `{{to_email}}` (or directly use: nathan.arka.wibisono@gmail.com)
5. Copy your **Template ID** (e.g., `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `xxxxxxxxxxxxx`)

### Step 5: Update the Website
1. Open `script.js` file
2. Find these lines at the top:
```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```
3. Replace with your actual values:
```javascript
const EMAILJS_SERVICE_ID = 'service_xxxxxxx';
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx';
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxx';
```

## How It Works

### Primary Method: Email
- When a customer submits a booking, the form automatically sends an email to **nathan.arka.wibisono@gmail.com**
- The email contains all booking details (customer name, phone, room type, date, time, duration, price, payment method, notes)
- If email sending fails, the system will offer WhatsApp as a backup

### Backup Method: WhatsApp
- Customers can also choose to send booking via WhatsApp by clicking the "Send via WhatsApp" button
- This opens WhatsApp with a pre-filled message containing all booking details
- The message is sent to: **+62 8877050607**

## Testing

1. Fill out the booking form on the website
2. Click "Confirm Booking"
3. Check your email (nathan.arka.wibisono@gmail.com) for the booking notification
4. If email is not configured yet, you can test with the WhatsApp button

## Free Tier Limits (EmailJS)
- 200 emails per month (free tier)
- Sufficient for most small businesses
- Upgrade available if needed

## Troubleshooting

**Email not sending?**
- Check that EmailJS credentials are correctly set in `script.js`
- Verify your email service is connected in EmailJS dashboard
- Check EmailJS dashboard for error logs
- Make sure the template has the correct variable names

**WhatsApp not working?**
- Verify the phone number format: `628877050607` (no +, no spaces)
- Make sure WhatsApp is installed on the device

