import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Bridal Makeup',
        'Party Makeup',
        'HD Makeup',
        'Hair Styling',
        'Pre-Wedding Makeup',
        'Engagement & Reception Makeup',
        'Nail Art',
        'Custom Services',
      ],
    },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 15 }, // minutes
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ name: 'text', description: 'text', category: 'text' });
serviceSchema.index({ category: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
