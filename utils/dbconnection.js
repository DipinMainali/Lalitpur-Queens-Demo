import { connect, ConnectionStates } from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: __dirname + "/.env.local",
});
const MONGO_URI =
  "mongodb+srv://nikeshmainali:mainalinikesh@volleyball.q14jj.mongodb.net/Volleyball?retryWrites=true&w=majority&appName=Volleyball";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 
Global is used here to maintain a cached connection across hot reloads
in development. This prevents connections from growing exponentially
during API Route usage.
*/

export default async function dbConnect() {
  const connection = {
    isConnected: null,
  };

  try {
    if (connection.isConnected) {
      return;
    }
    const db = await connect(MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
  } catch (e) {
    console.error(e);
  }
}
