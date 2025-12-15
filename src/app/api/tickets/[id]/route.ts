import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Ticket from '@/models/ticket';
import { auth } from '../../../../../auth';
import { ObjectId } from 'mongodb';

// GET - Obtener un ticket específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de ticket inválido',
        },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: ticket,
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

// PUT - Actualizar un ticket (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de ticket inválido',
        },
        { status: 400 }
      );
    }

    const session = await auth();

    // Solo admin puede actualizar tickets
    if (!session?.user?.email || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No tienes permiso para actualizar tickets',
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const allowedUpdates = [
      'status',
      'priority',
      'assignedTo',
      'description',
      'title',
      'category',
    ];

    const updates: any = {};
    Object.keys(body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = body[key];
      }
    });

    const ticket = await Ticket.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket actualizado exitosamente',
        data: ticket,
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

// DELETE - Eliminar un ticket (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de ticket inválido',
        },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session?.user?.email || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No tienes permiso para eliminar tickets',
        },
        { status: 403 }
      );
    }

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket eliminado exitosamente',
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
