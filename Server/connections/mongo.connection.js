import mongoose from 'mongoose';
import { environment } from '../enviroment/enviroment.js';
export const mongooseConnection = async () => {
  try {

    const { extraQueryParams, host, pass, port, prefix, tls, user } = environment.mongo;
    const isProduction = environment.isProduction;

    console.log(`mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority`);
    const databaseUrl = isProduction
      ? `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority`
      : `mongodb://${user}:${pass}@${host}:${port}/?${extraQueryParams}`;
    console.time('MongoDB Connection Time');


    const dbName = prefix + 'theatrical';
    await mongoose.connect(databaseUrl, {
      dbName,
      minPoolSize: 100,
      maxPoolSize: 500,
      monitorCommands: true,
    });
    console.timeEnd('MongoDB Connection Time');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};
