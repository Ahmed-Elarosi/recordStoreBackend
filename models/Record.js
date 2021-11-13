import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const recordSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true // Basic built-in sanitization: trim
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        trim: true,
        default: 'http://dalelyles.com/musicmp3s/no_cover.jpg'
    }
},
{
    timestamps: true
});

const Record = model('Record', recordSchema);

export default Record;