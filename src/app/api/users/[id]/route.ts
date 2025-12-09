import dbConnect from '@/app/lib/mongoose';
import User from '@/models/user';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return Response.json({ data: user }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, role, phone, isActive } = body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        phone,
        isActive,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return Response.json(
      { data: user, message: 'Usuario actualizado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Usuario eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
