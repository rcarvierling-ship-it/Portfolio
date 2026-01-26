import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createContactMessage } from '@/lib/cms';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Save to database (inbox) first
        const saved = await createContactMessage({ name, email, message });
        if (!saved) {
            return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
        }

        // Optionally send email via Resend
        if (resend) {
            const { data, error } = await resend.emails.send({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: ['info@rcv-media.com'],
                subject: `New Contact from ${name}`,
                replyTo: email,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            });
            if (error) {
                console.error("Resend Error:", error);
                // Still return success; message is in inbox
            }
            return NextResponse.json({ success: true, data });
        }

        return NextResponse.json({ success: true, warning: 'Email not sent (No Resend API Key). Message saved to inbox.' });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
