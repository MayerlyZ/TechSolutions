import dbConnect from '@/app/lib/mongoose';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Verificar si el usuario admin ya existe
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      return Response.json(
        { message: 'El usuario admin ya existe', user: existingAdmin },
        { status: 200 }
      );
    }

    // Crear el usuario admin
    const hashedPassword = await bcryptjs.hash('admin123', 10);

    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1234567890',
      address: {
        street: 'Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '00000',
        country: 'Admin Country',
      },
      isActive: true,
    });

    await adminUser.save();

    return Response.json(
      {
        message: 'Usuario admin creado exitosamente',
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear usuario admin:', error);
    return Response.json(
      { error: error.message || 'Error al crear usuario admin' },
      { status: 500 }
    );
  }
}
