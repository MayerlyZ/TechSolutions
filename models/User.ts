
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true, 
    trim: true,
    match: [/.+@.+\..+/, 'Por favor, ingresa un email válido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    select: false 
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
}, {
  timestamps: true 
});

export default mongoose.models.User || mongoose.model('User', UserSchema);