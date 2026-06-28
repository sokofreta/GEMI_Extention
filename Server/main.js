import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { mongooseConnection } from "./connections/mongo.connection.js";
import { mainRoutes } from "./routes/main.routes.js";
import http from "http";
import { gracefulShutdown } from "./helpers.js";
import { Server } from "socket.io";
import { MysqlConnection } from "./connections/Mysql.connection.js";
import path from "path";

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
app.use(cors({ origin: '*', methods: ["GET", "POST"] }));
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use(mainRoutes);

//Run production code at localhost:1000
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


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
