import mongoose, { Schema } from 'mongoose';

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
    },
    category: {
      type: String,
      default: 'general',
      enum: ['general', 'hardware', 'software', 'network', 'other'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    clientName: {
      type: String,
    },
    clientEmail: {
      type: String,
    },
    clientPhone: {
      type: String,
    },
    createdByEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Ticket ||
  mongoose.model('Ticket', TicketSchema);