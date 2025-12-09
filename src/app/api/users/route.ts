import dbConnect from '@/app/lib/mongoose';
import User from '@/models/user';

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Obtener todos los usuarios
    const users = await User.find({}).select('-password');

    return Response.json(
      {
        data: users,
        count: users.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    return Response.json(
      { error: error.message || 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'customer',
      phone: phone || '',
    });

    await user.save();

    return Response.json(
      {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    return Response.json(
      { error: error.message || 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
