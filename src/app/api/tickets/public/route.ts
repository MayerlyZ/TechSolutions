import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Ticket from '@/models/ticket';

// POST - Crear un ticket público (sin autenticación)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, phone, title, description, category, priority } =
      await request.json();

    // Validar campos requeridos
    if (!name || !email || !phone || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos requeridos deben ser completados',
        },
        { status: 400 }
      );
    }

    // Crear el ticket sin usuario autenticado
    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'low',
      category: category || 'general',
      status: 'open',
      // Guardamos la información del cliente no autenticado
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      createdByEmail: email, // Para identificar quién lo creó sin requerir user ID
      isPublic: true, // Marcar como ticket público
    });

    await ticket.save();

    // Aquí podrías enviar un email de confirmación al cliente
    // await sendTicketConfirmationEmail(email, ticket._id, name);

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket creado exitosamente',
        ticketId: ticket._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear ticket público:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al crear el ticket',
      },
      { status: 500 }
    );
  }
}
