import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Ticket from '@/models/ticket';
import { auth } from '../../../../../../auth';

// GET - Obtener todos los tickets (solo admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();

    // Verificar que sea admin
    if (!session?.user?.email || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado',
        },
        { status: 401 }
      );
    }

    const tickets = await Ticket.find()
      .populate('createdBy', 'name email')
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
