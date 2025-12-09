import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'El ID del ticket es requerido'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor del comentario es requerido'],
    },
    message: {
      type: String,
      required: [true, 'El mensaje es requerido'],
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Comment ||
  mongoose.model('Comment', CommentSchema);