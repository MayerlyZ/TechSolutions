import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Order from '@/models/comment';
import { ObjectId } from 'mongodb';

// GET - Obtener una orden específica por ID
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
          error: 'ID de orden inválido',
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(id)
      .populate('userId', 'name email')
      .populate('items.commentId', 'name price');

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orden no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
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

// PUT - Actualizar estado de una orden
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
          error: 'ID de orden inválido',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: body.status,
        paymentStatus: body.paymentStatus,
        notes: body.notes,
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orden no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Orden actualizada exitosamente',
        data: order,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }
}

// DELETE - Cancelar una orden (soft delete)
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
          error: 'ID de orden inválido',
        },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orden no encontrada',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Orden cancelada exitosamente',
        data: order,
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
