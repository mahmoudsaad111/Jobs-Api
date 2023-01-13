require('dotenv').config();
require('express-async-errors');

const helmet=require('helmet')
const rateLimiter=require('express-rate-limit'); 
const cors=require('cors') 
const xss=require('xss-clean')

const express = require('express');
const app = express();
const connecdb=require('./db/connect')

const  authRouter=require('./routes/auth'); 
const jobsRouter=require('./routes/jobs'); 
const authUser=require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.set('trust proxy', 1)
app.use(rateLimiter({windowms:15*60*1000,max:100}))
app.use(helmet())
app.use(xss())
app.use(cors())
// extra packages

// routes
app.use('/api/v1/auth',authRouter); 
app.use('/api/v1/jobs',authUser,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connecdb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
