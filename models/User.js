import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import createError from 'http-errors';

import { encryptPassword, comparePassword } from '../helpers/encryption.js';
import { signJWT, verifyJWT } from '../helpers/authentication.js';

import Address from './Address.js';

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
            /*
        validate: {
            validator: value => validator.isAlpha(value),
            message: 'Only letters allowed'
        }
        */
        },
        lastName: {
            type: String,
            required: true
            /*
        validate: {
            validator: value => validator.isAlpha(value),
            message: 'Only letters allowed'
        }
        */
        },
        alias: {
            type: String,
            unique: true,
            sparse: true
        },
        email: {
            type: String,
            required: true,
            unique: true
            /* validate: {
            // validator.js returns a Boolean, which is exactly what the Schema validation wants. Handy!
            validator: value => validator.isEmail(value),
            message: 'Not a valid email address'
        } */
        },
        password: {
            type: String,
            required: true
        },
        billingAddress: {
            type: Address,
            required: true // Make the sub-document itself required if you need it
        },
        shippingAddress: {
            type: Address
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Invalid user role {VALUE}'
            },
            default: 'user'
        }
    },
    {
        timestamps: true
        // Configuration object: Include virtuals in JSON, now defined in userSchema.set()
        // toJSON: {
        //     virtuals: true
        // }
    }
);

// We can provide virtual fields that do not exist in the database!
// Use case: A "fullName" field which makes it easy to display a user's full name, but based on the firstName and lastName fields
userSchema
    .virtual('fullName') // define the field name via the virtual() method
    // Define what vale to return for the field inside of get()
    // No arrow functions here, you need 'this'
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    })
    .set(function (value) {
        // 'Steve Michael Wozniak, Sr.'
        // Split the string, make the first item the firstName
        // Make all the other items the last name
        // Works only when creating documents, not when you update!
        const [firstName, ...lastNames] = value.split(' ');
        const lastName = lastNames.join(' ');
        // Set the firstName and lastName fields internally via this.set()
        this.set({ firstName, lastName });
    });

// We can add Mongoose Hooks to our Schema that run automatically before (pre()) or after(post()) a certain (like save happens)
// Make sure that your function is async, or use and call the next() argument
userSchema.pre('save', async function () {
    // In document middleware, this is the document
    // Encrypt the password when we are saving
    this.password = await encryptPassword(this.password);
});
/*
userSchema.pre('save', function(next) {
    encryptPassword(this.password).then(hashedPassword => {
        this.password = hashedPassword;
        next();
    });
});
*/

// We can add our own prototype methods to a schema with Schema.method()
userSchema.method('authenticate', async function (clearTextPassword) {
    // Compare the encrypted password with the given one
    return await comparePassword(clearTextPassword, this.password);
});

// Another method for a User that generates an auth token
userSchema.method('generateJWT', async function () {
    return await signJWT({ id: this._id, type: 'auth' }, process.env.JWT_SECRET, { expiresIn: '7d' });
});

// To verify our JWT token we will create a static method that we an run on the abstract User class (because we don't have a User yet, we need to find it!)
// => userSchema.static()
userSchema.static('verifyToken', async function (token) {
    try {
        // Is the token from our server, and unchanged?
        // If so, we get a the decoded payload back
        const decodedToken = await verifyJWT(token, process.env.JWT_SECRET);
        // Find a user by the payload.id, and return it
        return await this.findById(decodedToken.id);
    } catch (err) {
        throw new createError.Unauthorized();
    }
});

userSchema.pre('save', async function () {
    // Make sure that new signups are always users, not admins
    if (this.role === 'admin') this.role = 'user';
});

// Workaround for PUT /users – no save event is emitted by the Query. We need to use a different hook
userSchema.pre('findOneAndUpdate', async function () {
    // In query middleware, this is the query, which means there is no this.password;
    // Here, you should check for whether the password has been updated
    if (!this._update.password) return;
    this._update.password = await encryptPassword(this._update.password);
});

// We can override built-in Mongoose methods with Schema.set()
// We want to run our own function whenever Mongoose returns data so that the password is never included in that data
// We override the built-in toJSON() method
userSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        // "blacklist"
        delete ret.password;
        return ret;
        // "whitelist"
        // const { firstName, email, billingAddress } = ret;
        // return { firstName, email, billingAddress };
    }
});

const User = model('User', userSchema);

export default User;
