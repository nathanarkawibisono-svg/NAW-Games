// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials
// Get them from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
const OWNER_EMAIL = 'nathan.arka.wibisono@gmail.com'; // Owner's email address
const OWNER_WHATSAPP_NUMBER = '628877050607'; // Owner's WhatsApp number (format: country code + number, no + or spaces)

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Room pricing
const roomPrices = {
    regular: 10000,
    premium: 15000,
    vip1: 45000,
    vip2: 40000,
    simulator: 25000
};

const roomNames = {
    regular: 'Regular Room',
    premium: 'Premium Room',
    vip1: 'VIP Room 1',
    vip2: 'VIP Room 2',
    simulator: 'Simulator Room'
};

// Booking form elements
const bookingForm = document.getElementById('bookingForm');
const roomTypeSelect = document.getElementById('roomType');
const durationSelect = document.getElementById('duration');
const priceSummary = document.getElementById('priceSummary');
const summaryRoom = document.getElementById('summaryRoom');
const summaryDuration = document.getElementById('summaryDuration');
const summaryTotal = document.getElementById('summaryTotal');
const submitBtn = document.getElementById('submitBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const loadingMessage = document.getElementById('loadingMessage');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Calculate and display price
function calculatePrice() {
    const roomType = roomTypeSelect.value;
    const duration = parseInt(durationSelect.value);
    
    if (roomType && duration) {
        const pricePerHour = roomPrices[roomType];
        const total = pricePerHour * duration;
        
        summaryRoom.textContent = roomNames[roomType];
        summaryDuration.textContent = duration;
        summaryTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        priceSummary.style.display = 'block';
    } else {
        priceSummary.style.display = 'none';
    }
}

// Update price when room type or duration changes
roomTypeSelect.addEventListener('change', calculatePrice);
durationSelect.addEventListener('change', calculatePrice);

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Get form data
function getFormData() {
    return {
        roomType: roomTypeSelect.value,
        roomName: roomNames[roomTypeSelect.value],
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        duration: durationSelect.value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('notes').value,
        total: roomPrices[roomTypeSelect.value] * parseInt(durationSelect.value)
    };
}

// Validate form
function validateForm() {
    if (!roomTypeSelect.value || !dateInput.value || !document.getElementById('time').value || 
        !document.getElementById('name').value || !document.getElementById('phone').value) {
        alert('Please fill in all required fields');
        return false;
    }
    return true;
}

// Send booking via EmailJS
async function sendBookingEmail(formData) {
    try {
        const templateParams = {
            to_email: OWNER_EMAIL,
            from_name: formData.name,
            from_phone: formData.phone,
            from_email: formData.phone + '@temp.com', // Placeholder, can be updated if you collect email
            room_type: formData.roomName,
            booking_date: new Date(formData.date).toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            booking_time: formData.time,
            duration: `${formData.duration} hour(s)`,
            payment_method: formData.payment.charAt(0).toUpperCase() + formData.payment.slice(1),
            total_price: `Rp ${formData.total.toLocaleString('id-ID')}`,
            notes: formData.notes || 'No additional notes',
            message: `New booking from ${formData.name}`,
            subject: `New Booking - ${formData.roomName} - ${formData.name}`
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        return true;
    } catch (error) {
        console.error('EmailJS Error:', error);
        return false;
    }
}

// Send booking via WhatsApp
function sendBookingWhatsApp(formData) {
    const formattedDate = new Date(formData.date).toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const message = `*NEW BOOKING - NAW GAMES*

👤 *Customer Name:* ${formData.name}
📞 *Phone:* ${formData.phone}

🏠 *Room Type:* ${formData.roomName}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${formData.time}
⏱️ *Duration:* ${formData.duration} hour(s)

💰 *Total Price:* Rp ${formData.total.toLocaleString('id-ID')}
💳 *Payment Method:* ${formData.payment.charAt(0).toUpperCase() + formData.payment.slice(1)}

${formData.notes ? `📝 *Notes:* ${formData.notes}` : ''}

---
Please confirm this booking.`;

    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = getFormData();
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    loadingMessage.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Check if EmailJS is configured
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // EmailJS not configured, use WhatsApp instead
        loadingMessage.style.display = 'none';
        sendBookingWhatsApp(formData);
        showSuccessMessage();
        resetForm();
    } else {
        // Try to send via EmailJS
        const emailSent = await sendBookingEmail(formData);
        
        loadingMessage.style.display = 'none';
        
        if (emailSent) {
            showSuccessMessage();
            resetForm();
        } else {
            errorMessage.style.display = 'block';
            // Also offer WhatsApp as backup
            setTimeout(() => {
                if (confirm('Email sending failed. Would you like to send the booking via WhatsApp instead?')) {
                    sendBookingWhatsApp(formData);
                }
            }, 1000);
        }
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm Booking';
});

// WhatsApp button handler
whatsappBtn.addEventListener('click', () => {
    if (!validateForm()) {
        return;
    }
    
    const formData = getFormData();
    sendBookingWhatsApp(formData);
});

// Show success message
function showSuccessMessage() {
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Reset form
function resetForm() {
    bookingForm.reset();
    priceSummary.style.display = 'none';
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll('.facility-card, .room-card, .game-category, .contact-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});




