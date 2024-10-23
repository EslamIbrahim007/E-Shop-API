/* eslint-disable import/extensions */
import { readFileSync } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'colors';
import dotenv from 'dotenv';
import Product from '../../models/ProductModel.js';
import dbConnection from '../../config/database.js';

dotenv.config({ path: '../../.env' });



// Connect to DB
dbConnection();
const URI = process.env.BD_URL;
console.log('MongoDB URI:', URI); // This should print the URI
if (!URI) {
  console.error('MongoDB URI is not defined in the environment variables');
  process.exit(1);
}

// Read data
const products = JSON.parse(readFileSync('./products.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);
    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}