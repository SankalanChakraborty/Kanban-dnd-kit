import app from "./app.ts";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.ts";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
