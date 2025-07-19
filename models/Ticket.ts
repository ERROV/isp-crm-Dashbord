import  { Schema, models, model } from 'mongoose';
import { Ticket as ITicket, TicketStatus, ProblemType } from '../types';

const TicketSchema = new Schema<ITicket>({
  title: { type: String, required: true },
  descriptionParts: [{
    type: { type: String, enum: ['text', 'image'], required: true },
    content: { type: String, required: true },
  }],
  status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.OPEN },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscriberId: { type: Schema.Types.ObjectId, ref: 'Subscriber' },
  agentId: { type: Schema.Types.ObjectId, ref: 'User' },
  resellerId: { type: String }, // Can be changed to ObjectId if Resellers become a model
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: { type: Date, default: Date.now },
  }],
  problemType: { type: String, enum: Object.values(ProblemType), required: true },
  diagnosis: String,
  actionTaken: String,
  result: String,
}, { timestamps: true });

export default models.Ticket || model<ITicket>('Ticket', TicketSchema);
