require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//-- ConnectDB
const connectDB = require('./db/connect');

const authenticateUser = require('./middleware/authentication');

//-- Routers
const authRouter = require('./routes/auth');
// const commentsRouter = require('./routes/comments');
const locationsRouter = require('./routes/locations');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

//-- Routes
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/comments',authenticateUser, commentsRouter);
// app.use('/api/v1/locations',authenticateUser, locationsRouter);

// Mount locations router at /locations; this router will internally mount comments
app.use('/api/v1/locations',authenticateUser, locationsRouter);
// app.use('/api/v1/locations',authenticateUser, commentsRouter);  // Merged to handle /locations/:locationId/comments properly

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
