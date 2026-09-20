import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

console.log("🔑 RZP_KEY_ID:", process.env.RZP_KEY_ID);
console.log("🔑 RZP_KEY_SECRET:", process.env.RZP_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET
});

export default razorpay;

