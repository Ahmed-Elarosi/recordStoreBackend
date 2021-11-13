// All controllers for the /records route go here
import createError from 'http-errors';

// Import the Record model to talk to the database
import Record from '../models/Record.js';

export const getRecords = async (req, res, next) => {
    // Try ... catch here as well now because Mongoose will throw errors
    try {
        // Get data from the database using the static Model.find(<query>) method
        // const records = await Record.find({});
        // You can implement filtering by passing req.query into Model.find()
        const records = await Record.find({})
            // With Mongoose we can further filter our queries by chaining query methods
            // Don't forget to provide fallbacks for query parameters if they are not used
            // .where('year').equals(2015) // ====
            // .where('artist', new RegExp(req.query.artistquery || '')) // Regex (contains, starts with, ends with)
            .where('year')
            .gte(req.query.yearmin || 1900)
            .lte(req.query.yearmax || Infinity) // <=, >=
            // .where('year').in([ 2005, 1999, 2012 ]) // One of these values
            // .where('year').in([req.query.year]) // One of these values
            .sort({ year: 1 });
        // To explicitly send a status code with your response, simply add res.status(<code>)
        res.status(200).send(records);
    } catch (err) {
        next(err);
    }
};

export const addRecord = async (req, res, next) => {
    // When the server receives JSON with a request, it will be available in req.body
    try {
        // Create document via the Schema
        const newRecord = new Record(req.body);
        // Save the document into the database
        // await Record.create(newRecord);
        await newRecord.save();
        res.status(201).send(newRecord);
    } catch (err) {
        next(err);
    }
};

export const getSingleRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        // To find by Mongo ObjectId, Mongoose provides model.findById()
        const record = await Record.findById(id);
        // If we get nothing back, throw a 404
        if (!record) throw new createError.NotFound();
        res.status(200).send(record);
    } catch (err) {
        next(err);
    }
};

export const deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Special Mongoose method to delete by ID: model.findByIdAndRemove()
        // We get the deleted record back
        const deleted = await Record.findByIdAndRemove(id);
        // If nothing was deleted (findByIdAndRemove returns null), throw an error
        if (!deleted) throw new createError.NotFound();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Special Mongoose method to update by ID: model.findByIdAndUpdate()
        // Update the found record with what is inside req.body
        // This will do an INCREMENTAL update, so only changed fields must be present
        // Make sure that the changed version is returned by adding the new: true config option
        // Make sure that Schema validation also occurs when updating by adding runValidators: true
        const updated = await Record.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        // If nothing was updated, throw a 404
        if (!updated) throw new createError.NotFound();
        res.status(200).send(updated);
    } catch (err) {
        next(err);
    }
};

export const get1990sRecords = async (req, res, next) => {
    try {
        const records = await Record.find({}).where('year').gte(1990).lte(1999);
        res.status(200).send(records);
    } catch (err) {
        next(err);
    }
};

export const getRecordsByYear = async (req, res, next) => {
    try {
        const { year } = req.params;
        const records = await Record.find({}).where('year').equals(year);
        res.status(200).send(records);
    } catch (err) {
        next(err);
    }
};
