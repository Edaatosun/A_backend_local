const express = require("express");
const http = require("http");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");

require("./db/dbConnection.cjs");

const User = require("./models/userModel.cjs");
const Room = require("./models/roomModel.cjs");
const Message = require("./models/messageModel.cjs");

const activeStudentsRouter = require("./routers/activeStudentsRouter.cjs");
const passiveStudentsRouter = require("./routers/passiveStudentsRouter.cjs");
const actionRouter = require("./routers/actionRouter.cjs");
const uploadRouter = require("./routers/uploadRouter.cjs");

const { initSocket} = require("./socket/socketManager.cjs");

const app = express();
const server = http.createServer(app);
initSocket(server); // socket’i başlat

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.get("/", (req, res) => {
  res.send("API + WebSocket birleşik çalışıyor!");
});

app.use("/active", activeStudentsRouter);
app.use("/upload", uploadRouter);
app.use("/passive", passiveStudentsRouter);
app.use("/action", actionRouter);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda birleşik çalışıyor (API + WebSocket)!`);
});
