import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { mongooseConnection } from "./connections/mongo.connection.js";
import { mainRoutes } from "./routes/main.routes.js";
import http from "http";
import { gracefulShutdown } from "./helpers.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use(mainRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("test", { message: "Connection successful!" });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

(async () => {
  await mongooseConnection();
  const PORT = process.env.PORT || 1000;

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export { io };
