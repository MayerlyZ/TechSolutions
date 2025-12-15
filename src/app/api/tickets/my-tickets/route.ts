import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Ticket from '@/models/ticket';

// GET - Obtener tickets por email (sin autenticación necesaria)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email es requerido',
        },
        { status: 400 }
      );
    }

    // Buscar tickets creados por este email
    const tickets = await Ticket.find({
      $or: [
        { clientEmail: email }, // Tickets públicos creados por este email
        { createdByEmail: email }, // Tickets creados por este email
      ],
    })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: tickets,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
