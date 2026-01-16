// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const recaptchaForm = document.getElementById('recaptcha-form');
const turnstileForm = document.getElementById('turnstile-form');

// Captcha widget IDs
let recaptchaWidgetId;
let turnstileWidgetId;

// Tab switching logic
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Update active tab
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide forms
        if (tab === 'recaptcha') {
            recaptchaForm.style.display = 'block';
            turnstileForm.style.display = 'none';
        } else {
            recaptchaForm.style.display = 'none';
            turnstileForm.style.display = 'block';
        }
    });
});

// Validation functions
function validateName(name) {
    return name && name.trim().length >= 2 ? '' : 'Name must be at least 2 characters long';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email) ? '' : 'Please enter a valid email address';
}

function validateSubject(subject) {
    return subject && subject.trim().length >= 3 ? '' : 'Subject must be at least 3 characters long';
}

function validateMessage(message) {
    return message && message.trim().length >= 10 ? '' : 'Message must be at least 10 characters long';
}

function showError(errorElement, message) {
    errorElement.textContent = message;
}

function clearError(errorElement) {
    errorElement.textContent = '';
}

function showResponseMessage(messageElement, message, type) {
    messageElement.textContent = message;
    messageElement.className = `response-message ${type}`;
    setTimeout(() => {
        messageElement.className = 'response-message';
    }, 5000);
}

// Initialize reCAPTCHA
window.onRecaptchaLoad = function () {
    if (typeof grecaptcha !== 'undefined') {
        recaptchaWidgetId = grecaptcha.render('recaptcha-widget', {
            'sitekey': 'YOUR_RECAPTCHA_SITE_KEY_HERE',
            'theme': 'dark'
        });
    }
};

// Initialize Turnstile
window.onTurnstileLoad = function () {
    if (typeof turnstile !== 'undefined') {
        turnstileWidgetId = turnstile.render('#turnstile-widget', {
            sitekey: 'YOUR_TURNSTILE_SITE_KEY_HERE',
            theme: 'dark'
        });
    }
};

// reCAPTCHA Form Submission
document.getElementById('recaptchaContactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('recaptchaSubmitBtn');
    const responseMessage = document.getElementById('recaptchaResponseMessage');

    // Get form values
    const name = document.getElementById('recaptcha-name').value;
    const email = document.getElementById('recaptcha-email').value;
    const subject = document.getElementById('recaptcha-subject').value;
    const message = document.getElementById('recaptcha-message').value;

    // Clear errors
    clearError(document.getElementById('recaptcha-nameError'));
    clearError(document.getElementById('recaptcha-emailError'));
    clearError(document.getElementById('recaptcha-subjectError'));
    clearError(document.getElementById('recaptcha-messageError'));
    clearError(document.getElementById('recaptcha-captchaError'));
    responseMessage.className = 'response-message';

    // Validate
    let hasError = false;

    const nameError = validateName(name);
    if (nameError) {
        showError(document.getElementById('recaptcha-nameError'), nameError);
        hasError = true;
    }

    const emailError = validateEmail(email);
    if (emailError) {
        showError(document.getElementById('recaptcha-emailError'), emailError);
        hasError = true;
    }

    const subjectError = validateSubject(subject);
    if (subjectError) {
        showError(document.getElementById('recaptcha-subjectError'), subjectError);
        hasError = true;
    }

    const messageError = validateMessage(message);
    if (messageError) {
        showError(document.getElementById('recaptcha-messageError'), messageError);
        hasError = true;
    }

    // Check reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);
    if (!recaptchaResponse) {
        showError(document.getElementById('recaptcha-captchaError'), 'Please complete the reCAPTCHA verification');
        hasError = true;
    }

    if (hasError) return;

    // Submit
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        const response = await fetch('/api/contact-recaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
                recaptchaToken: recaptchaResponse
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showResponseMessage(responseMessage, 'Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            grecaptcha.reset(recaptchaWidgetId);
        } else {
            showResponseMessage(responseMessage, data.message || 'Something went wrong. Please try again.', 'error');
            grecaptcha.reset(recaptchaWidgetId);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showResponseMessage(responseMessage, 'Network error. Please check your connection and try again.', 'error');
        grecaptcha.reset(recaptchaWidgetId);
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// Turnstile Form Submission
document.getElementById('turnstileContactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('turnstileSubmitBtn');
    const responseMessage = document.getElementById('turnstileResponseMessage');

    // Get form values
    const name = document.getElementById('turnstile-name').value;
    const email = document.getElementById('turnstile-email').value;
    const subject = document.getElementById('turnstile-subject').value;
    const message = document.getElementById('turnstile-message').value;

    // Clear errors
    clearError(document.getElementById('turnstile-nameError'));
    clearError(document.getElementById('turnstile-emailError'));
    clearError(document.getElementById('turnstile-subjectError'));
    clearError(document.getElementById('turnstile-messageError'));
    clearError(document.getElementById('turnstile-captchaError'));
    responseMessage.className = 'response-message';

    // Validate
    let hasError = false;

    const nameError = validateName(name);
    if (nameError) {
        showError(document.getElementById('turnstile-nameError'), nameError);
        hasError = true;
    }

    const emailError = validateEmail(email);
    if (emailError) {
        showError(document.getElementById('turnstile-emailError'), emailError);
        hasError = true;
    }

    const subjectError = validateSubject(subject);
    if (subjectError) {
        showError(document.getElementById('turnstile-subjectError'), subjectError);
        hasError = true;
    }

    const messageError = validateMessage(message);
    if (messageError) {
        showError(document.getElementById('turnstile-messageError'), messageError);
        hasError = true;
    }

    // Check Turnstile
    const turnstileResponse = turnstile.getResponse(turnstileWidgetId);
    if (!turnstileResponse) {
        showError(document.getElementById('turnstile-captchaError'), 'Please complete the verification challenge');
        hasError = true;
    }

    if (hasError) return;

    // Submit
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        const response = await fetch('/api/contact-turnstile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
                turnstileToken: turnstileResponse
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showResponseMessage(responseMessage, 'Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            turnstile.reset(turnstileWidgetId);
        } else {
            showResponseMessage(responseMessage, data.message || 'Something went wrong. Please try again.', 'error');
            turnstile.reset(turnstileWidgetId);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showResponseMessage(responseMessage, 'Network error. Please check your connection and try again.', 'error');
        turnstile.reset(turnstileWidgetId);
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});
