import mongoose from 'mongoose';

import User from '../models/User.js';
import Record from '../models/Record.js';

// Connect to the database
mongoose
    .connect('mongodb://localhost:27017/record-store', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    })
    .catch(err => console.log(err));

// Delete certain items from a collection with the static method Model.deleteMany(<queryObject>);
const purgeItems = async () => {
    try {
        await Record.deleteMany({});
        await User.deleteMany({});
        console.log('Items purged');
    } catch(err) {
        console.log(err);
    }
    
}

purgeItems().then(() => mongoose.connection.close());