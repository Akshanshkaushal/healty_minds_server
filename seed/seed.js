const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const dotenv = require("dotenv");
const Connection = require("../config/db");

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const predefinedRooms = [
  { chatName: "Anxiety", isGroupChat: true },
  { chatName: "Tech Talk", isGroupChat: true },
  { chatName: "Gaming", isGroupChat: true },
  { chatName: "Random", isGroupChat: true }
];

async function seedDatabase() {
  try {
    await Connection(username, password);
    console.log("Connected to database");

    await Chat.deleteMany({}); // Clear the existing chats
    
    for (let room of predefinedRooms) {
      const chatRoom = new Chat(room);
      await chatRoom.save();
    }

    console.log("Database seeded with predefined rooms");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();