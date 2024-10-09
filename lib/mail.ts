'use server'

import nodemailer from 'nodemailer'
import { z } from 'zod'

// Email validation schema
const emailSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters long'),
})

// Create a transporter using Gmail's SMTP server with TLS
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
        minVersion: 'TLSv1.2',
        ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256',
        rejectUnauthorized: true,
    }
})

// Verify the transporter configuration
transporter.verify((error) => {
    if (error) {
        console.error('SMTP connection error:', error)
    } else {
        console.log('SMTP connection established successfully')
    }
})

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_REQUESTS = 5

function checkRateLimit(email: string): boolean {
    const now = Date.now()
    const userRequests = rateLimitMap.get(email) || []

    // Remove timestamps older than the rate limit window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)

    if (recentRequests.length >= MAX_REQUESTS) {
        return false
    }

    recentRequests.push(now)
    rateLimitMap.set(email, recentRequests)

    return true
}

export async function sendEmail(formData: FormData) {
    // Validate form data
    const validatedFields = emailSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    })

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.errors[0].message }
    }

    const { name, email, message } = validatedFields.data

    // Check rate limit
    if (!checkRateLimit(email)) {
        return { success: false, message: 'Rate limit exceeded. Please try again later.' }
    }

    const mailOptions = {
        from: `"${name}" <${process.env.GMAIL_USER}>`,
        replyTo: email,
        to: process.env.RECIPIENT_EMAIL,
        subject: `New contact form submission from ${name}`,
        text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
        html: `
      <h1>New contact form submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, message: 'Failed to send email. Please try again later.' }
    }
}