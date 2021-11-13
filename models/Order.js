import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    record: {
        type: Schema.Types.ObjectId, // Access the ObjectId inside the Mongoose Schema class
        required: true,
        ref: 'Record'
    },
    quantity: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

const Order = model('Order', orderSchema);

export default Order;