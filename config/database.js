/* eslint-disable no-undef */

//Importing Mongoose:
import {mongoose} from "mongoose" ;


const dbConnection = () => {
  // Connect with DB
  mongoose.connect(process.env.BD_URL).then((conn) => {
    console.log(`Database Conected :${conn.connection.host}`);
  })//.catch((err) => {
  //   console.error(`Datebase Error: ${err}`);
  //   process.exit()
  // });
}

export default dbConnection
