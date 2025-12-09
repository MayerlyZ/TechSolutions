
import dbConnect from './mongoose'; 
import UserModel from '../../../models/User';
import { User } from './definitions'; 
import mongoose from 'mongoose'; 

// Define an interface for the object returned by .lean()
interface MongooseLeanUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string; // Password might not be selected by default
}

export async function getUser(email: string): Promise<User | undefined> {  try {
    await dbConnect(); 
    
    console.log('Buscando usuario en MongoDB (con Mongoose):', email);

    const user = await UserModel.findOne({ email: email })
      .select('+password') 
      .lean<MongooseLeanUser>();              

    if (!user) {
      console.log('Usuario no encontrado.');
      return undefined;
    }

    // Now TypeScript knows 'user' is MongooseLeanUser
    // We can directly access properties and perform checks
    if (!user._id || !user.name || !user.email || !user.password) {
        return undefined;
    }

    const finalUser: User = {
      id: user._id.toString(), 
      name: user.name,
      email: user.email,
      password: user.password,
    };

    return finalUser;

  } catch (e) {
    console.error('Error al obtener el usuario con Mongoose:', e);
    throw new Error('Error al consultar la base de datos.');
  }
}