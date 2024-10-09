'use server'

import { redirect } from 'next/navigation'
import { createTransport } from 'nodemailer'

// Create a transporter using Gmail's SMTP server
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

export async function sendEmail(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        throw new Error('All fields are required')
    }

    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: `New contact form submission from ${name}`,
        text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
        html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
        redirect('/thank')
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error('Failed to send email. Please try again later.')
    }
}