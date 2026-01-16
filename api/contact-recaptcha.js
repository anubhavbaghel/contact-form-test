// Vercel Serverless Function for reCAPTCHA Form

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message, recaptchaToken } = req.body;

        if (!name || !email || !subject || !message || !recaptchaToken) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Verify reCAPTCHA
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        if (!recaptchaSecret) {
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken }).toString()
        });

        const recaptchaData = await recaptchaResponse.json();
        if (!recaptchaData.success) {
            return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
        }

        // Send email (optional)
        const gmailUser = process.env.GMAIL_USER;
        const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

        if (gmailUser && gmailAppPassword) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: gmailUser, pass: gmailAppPassword }
            });

            await transporter.sendMail({
                from: `"Contact Form (reCAPTCHA)" <${gmailUser}>`,
                to: process.env.RECIPIENT_EMAIL || gmailUser,
                subject: `New Contact: ${subject}`,
                replyTo: email,
                html: `<h2>New Contact Form Submission (reCAPTCHA)</h2>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Subject:</strong> ${subject}</p>
                       <p><strong>Message:</strong></p>
                       <p>${message}</p>`
            });
        }

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
}
