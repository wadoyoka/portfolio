'use server'

import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { checkRateLimitAction } from './ratelimit'

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

export async function sendEmail(formData: FormData) {
    // Create a mock NextRequest object
    const headersList = await headers()
    const mockRequest = {
        headers: {
            get: (name: string) => headersList.get(name),
            has: (name: string) => headersList.has(name),
            entries: () => headersList.entries(),
            keys: () => headersList.keys(),
            values: () => headersList.values(),
        },
        ip: headersList.get('x-forwarded-for') || 'unknown',
        nextUrl: new URL('http://localhost'), // Dummy URL
        geo: {},
        cookies: {
            get: () => undefined,
            getAll: () => [],
            has: () => false,
            set: () => {},
            delete: () => {},
        },
    } as unknown as NextRequest

    // Check email rate limit
    const { allowed, message: rateMessage, remainingAttempts } = await checkRateLimitAction(mockRequest, 'email')
    if (!allowed) {
        return { success: false, message: rateMessage, remainingAttempts }
    }

    // Validate form data
    const validatedFields = emailSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    })

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.errors[0].message, remainingAttempts }
    }

    const { name, email, message } = validatedFields.data

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
        return {
            success: true,
            message: 'Email sent successfully',
            remainingAttempts: remainingAttempts - 1
        }
    } catch (error) {
        console.error('Error sending email:', error)
        return {
            success: false,
            message: 'Failed to send email. Please try again later.',
            remainingAttempts
        }
    }
}