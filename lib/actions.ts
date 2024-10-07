'use server'

import { redirect } from 'next/navigation'

export async function sendEmail(formData: FormData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    // Here you would typically send the email using your preferred method
    // For example, using a service like SendGrid or your own SMTP server
    console.log('Sending email:', { name, email, message })

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect to a thank you page
    redirect('/thank')
}