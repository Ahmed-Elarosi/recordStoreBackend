// Third-party imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// First-party imports
import recordsRouter from "./routes/records.js";
import usersRouter from "./routes/users.js";
import ordersRouter from "./routes/orders.js";
import setCors from "./middleware/cors.js";
import { handleErrors, throw404 } from "./middleware/errors.js";

// Dotenv init
dotenv.config();

// Express init
const app = express();
const port = process.env.PORT || 3000;

// Mongoose init: Connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err));
mongoose.connection.once("open", () =>
  console.log(`Connected to MongoDB on port ${mongoose.connection.port}`)
);
mongoose.connection.on("error", (err) => console.log(err));

// Middleware
app.use(express.json());
app.use(setCors);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/records", recordsRouter);

// Error handling
// 404 trigger middleware (only runs if no other routes match)
app.use(throw404);
// As soon as you next() with an argument, the error handling middleware will run, and it will receive the passed value as its first argument
// The error handler has a special signature with an additional argument (err, req, res, next)
// This middleware must come last!
/* app.use((err, req, res, next) => {
    res.send({ error: err.message });
}); */
app.use(handleErrors);

// Start listening
app.listen(port, () => console.log(`Express running on port ${port}`));
