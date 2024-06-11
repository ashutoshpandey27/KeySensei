import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {PORT , mongoDBURL} from './config.js';
import scoreRoute from './routes/scoreRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();

// middleware configuration

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["content-type"],
};

app.use(cors(corsOptions));

// APT Route Handlers

app.use("/user", userRoute);
app.use("/score", scoreRoute);

// DB COnnection and Server Initialization

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App Connected to DB");
    app.listen(PORT, () => {
      console.log(`App is listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
