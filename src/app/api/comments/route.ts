import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import comment from '@/models/ticket';

// GET - Obtener todos los comments o filtrar por categoría
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = {};
    if (category) {
      query = { category, isActive: true };
    } else {
      query = { isActive: true };
    }

    const comments = await comment.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: comments,
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

// POST - Crear un nuevo commento
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const comment = new comment({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      image: body.image,
      stock: body.stock || 0,
      sku: body.sku,
    });

    const savedcomment = await comment.save();

    return NextResponse.json(
      {
        success: true,
        message: 'commento creado exitosamente',
        data: savedcomment,
      },
      { status: 201 }
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
