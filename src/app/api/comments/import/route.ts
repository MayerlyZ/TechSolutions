import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import comment from '@/models/ticket';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { comments } = await request.json();

    if (!Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        { error: 'No comments provided' },
        { status: 400 }
      );
    }

    // Validar y procesar comments
    const validcomments = comments.map((comment: any) => ({
      name: comment.name,
      description: comment.description || '',
      price: parseFloat(comment.price) || 0,
      stock: parseInt(comment.stock) || 0,
      category: comment.category || 'comments',
      sku: comment.sku || `SKU-${Date.now()}-${Math.random()}`,
      image: comment.image || '',
      isActive: true,
      createdAt: new Date(),
    }));

    // Insertar múltiples comments
    const result = await comment.insertMany(validcomments);

    return NextResponse.json(
      {
        success: true,
        imported: result.length,
        message: `${result.length} comments importados exitosamente`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al importar comments',
      },
      { status: 500 }
    );
  }
}
