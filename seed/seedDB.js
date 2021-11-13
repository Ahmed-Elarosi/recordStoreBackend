import mongoose from 'mongoose';
import faker from 'faker';

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

const capitalize = str => str.split(' ').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');

const writeFakeData = async () => {

    const fakeUsers = new Array(20).fill(null).map(() => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        return new User({
            firstName,
            lastName,
            email: faker.internet.exampleEmail(firstName.toLowerCase(), lastName.toLowerCase()),
            password: faker.internet.password(),
            billingAddress: {
                street: faker.address.streetAddress(),
                zip: faker.address.zipCode('#####'),
                city: faker.address.city(),
                country: faker.address.country()
            },
            shippingAddress: {
                street: faker.address.streetAddress(),
                zip: faker.address.zipCode('#####'),
                city: faker.address.city(),
                country: faker.address.country()
            }
        });
    });

    const fakeRecords = new Array(20).fill(null).map(() => new Record({
        title: capitalize(faker.random.words()),
        artist: capitalize(faker.random.words()),
        year: faker.date.past(30).getFullYear(),
        price: faker.finance.amount(9.99, 39.99)
    }));

    // Write fake data to the database
    // The static Model.create() method allows us to save multiple documents at the same time
    await User.create(fakeUsers);
    await Record.create(fakeRecords);
    console.log('Data seeded');
};

// Disconnect when done
writeFakeData()
    .then(() => mongoose.connection.close())
    .catch(err => {
        console.log(err); 
        mongoose.connection.close()
    });