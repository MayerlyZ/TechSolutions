import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Order from '@/models/comment';
import { auth } from '../../../../auth';

// GET - Obtener órdenes del usuario o todas (si es admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado',
        },
        { status: 401 }
      );
    }

    let query = {};

    // Buscar el usuario para obtener su ID
    const User = require('@/models/user').default;
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      query = { userId: user._id };
    }

    const tickets = await Order.find(query)
      .populate('userId', 'name email')
      .populate('items.commentId', 'name price')
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Buscar el usuario
    const User = require('@/models/user').default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        { status: 404 }
      );
    }

    const order = new Order({
      userId: user._id,
      items: body.items,
      totalAmount: body.totalAmount,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
    });

    const savedOrder = await order.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Orden creada exitosamente',
        data: savedOrder,
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
