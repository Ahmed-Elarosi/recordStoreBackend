import createError from "http-errors";

import Order from "../models/Order.js";
import Record from "../models/Record.js";

//orders-controllers
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate(
      "record",
      "-year -createdAt -updatedAt -__v"
    );
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const addOrder = async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);
    // Here we need to prevent bad record IDS from being saved
    // Search records for whether the given ID exists
    const recordExists = await Record.findById(newOrder.record);
    // If it doesn't exist, throw an error
    if (!recordExists)
      throw new createError.BadRequest("Record ID does not exist");
    // Otherwise save
    await newOrder.save();
    res.status(201).send(newOrder);
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate(
      "record",
      "-year -createdAt -updatedAt -__v"
    );
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndRemove(id);
    if (!deleted) throw new createError.NotFound();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Also check here if the record ID was updated with an invalid one
    if (req.body.record) {
      const recordExists = await Record.findById(req.body.record);
      if (!recordExists)
        throw new createError.BadRequest("Record ID not found");
    }
    // Alternatively: don't change record ID
    // delete req.body.record;
    // Or: Send an error if a record ID is provided
    // if (req.body.record) throw new createError.BadRequest('Record ID can\'t be changed');
    const updated = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new createError.NotFound();
    res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
};
