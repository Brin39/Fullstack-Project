import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Name is required'],
          trim: true
     },
     price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price cannot be negative']
     },
     description: {
          type: String,
          required: [true, 'Description is required'],
          trim: true
     },
     images: {
          type: [String],
          default: []
     },
     category: {
          type: String,
          required: false,
          default: "General"
     },
     stock: {
          type: Number,
          required: true,
          default: 0,
          min: [0, 'Stock cannot be negative']
     },
     bestOffer: {
          type: Boolean,
          default: false
     }
}, {
     timestamps: true
});


productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ bestOffer: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema); 