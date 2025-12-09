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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El creador del ticket es requerido'],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Ticket ||
  mongoose.model('Ticket', TicketSchema);