import mongoose from "mongoose";

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGODB_NAME })
  .then(() => { console.log(`MongoDB Connected`) })
  .catch((e) => { console.log(`MongoDB Connection Error - ${e}`) });
}

export default connectDatabase;