import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email, asunto, mensajeHtml } = await req.json();

    if (!email || !asunto || !mensajeHtml) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_API_KEY) {
      console.error('Variables de entorno no configuradas:', {
        user: process.env.GMAIL_USER ? 'OK' : 'FALTA',
        key: process.env.GMAIL_API_KEY ? 'OK' : 'FALTA'
      });
      return NextResponse.json({ error: 'Variables de entorno no configuradas' }, { status: 500 });
    }

    // Create a transporter object using the default SMTP transport
    // Replace with your own email service provider's details
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com'
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER, // Your email address
        pass: process.env.GMAIL_API_KEY, // Your email password or app password
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"TechSolutions" <${process.env.GMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: asunto, // Subject line
      html: mensajeHtml, // html body
    });

    console.log('Message sent: %s', info.messageId);
    return NextResponse.json({ res: 'Correo enviado exitosamente.' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Error al enviar el correo.' },
      { status: 500 }
    );
  }
}
