require('dotenv').config();
require('express-async-errors');

//-- Extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

//-- ConnectDB
const connectDB = require('./db/connect');

const authenticateUser = require('./middleware/authentication');

//-- Routers
const authRouter = require('./routes/auth');
const locationsRouter = require('./routes/locations');

//-- Error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);      // rateLimiter - Enable if behind a reverse proxy (Heroku, Bluemax, AWS ELB, Nginx)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,   // 15mins
    max: 100,                   // limit each IP to 100 requests per windowMs
  })
);

//-- Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//-- Routes
app.use('/api/v1/auth', authRouter);

// Mount locations router at /locations; this router will internally mount comments
app.use('/api/v1/locations',authenticateUser, locationsRouter);

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
