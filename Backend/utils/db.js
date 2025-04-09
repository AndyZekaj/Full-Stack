import mongoose from "mongoose";


export const connect2DB = async() => {
    try {
    mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
    mongoose.connection.on("error", (error) =>
      console.error("MongoDB Connection Error:", error)
    );
    const con2DB = await mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on("disconnected", () =>
      console.log("MongoDB Disconnected")
    );
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
}