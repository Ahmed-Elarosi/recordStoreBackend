import mongoose from 'mongoose';
const { Schema } = mongoose;

// Address sub-document

const Address = new Schema({
    street: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
},
{
    _id: false // Prevent ids from being added to an address (the parent document has one)
});

// We don't create a model, but directly export the Schema
export default Address;