import chalk from "chalk";
import Debug from "debug";
import mongoose from "mongoose";

const debug = Debug("gameboardlist:database:index");

const connectDB = (mongoUrl: string) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newDocument = { ...ret };
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument._id;
        delete newDocument.password;
        return newDocument;
      },
    });

    mongoose.connect(mongoUrl, (error) => {
      if (error) {
        debug(chalk.red(`Error connecting to database. ${error.message}`));
        reject(error);
        return;
      }

      debug(chalk.green("Connected to database"));
      resolve(true);
    });
  });

export default connectDB;
