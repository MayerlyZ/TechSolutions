import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import comment from '@/models/ticket';
import { ObjectId } from 'mongodb';

// GET - Obtener un commento específico por ID
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
          error: 'ID de commento inválido',
        },
        { status: 400 }
      );
    }

    const comment = await comment.findById(id);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'commento no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: comment,
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

// PUT - Actualizar un commento
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
          error: 'ID de commento inválido',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const comment = await comment.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        image: body.image,
        stock: body.stock,
        sku: body.sku,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'commento no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'commento actualizado exitosamente',
        data: comment,
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

// DELETE - Eliminar un commento
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
          error: 'ID de commento inválido',
        },
        { status: 400 }
      );
    }

    const comment = await comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'commento no encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'commento eliminado exitosamente',
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
