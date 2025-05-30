const dotenv = require('dotenv').config();
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

// DB bağlantısı ve modeller
require("./db/dbConnection.cjs");
const User = require("./models/userModel.cjs");
const activeStudentsRouter = require("./routers/activeStudentsRouter.cjs");
const passiveStudentsRouter = require("./routers/passiveStudentsRouter.cjs");
const actionRouter = require("./routers/actionRouter.cjs");
const uploadRouter = require("./routers/uploadRouter.cjs");

const app = express();
const server = http.createServer(app); // hem Express hem Socket için

// Socket tanımı
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const socketConnections = {};

// 🔌 Socket bağlantısı
io.on("connection", (socket) => {
  const token = socket.handshake.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    socketConnections[decoded.id] = socket;
    console.log(`🟢 Kullanıcı bağlandı: ${socket.user.id}`);
  } catch (err) {
    console.error("❌ Geçersiz token, bağlantı reddedildi.");
    socket.disconnect();
    return;
  }

  socket.on("disconnect", () => {
    if (socket.user && socketConnections[socket.user.id]) {
      delete socketConnections[socket.user.id];
      console.log(`🔴 Kullanıcı ayrıldı: ${socket.user.id}`);
    }
  });
});

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Route'lar
app.post("/addUser", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.send(newUser);
  } catch (err) {
    res.send({ msg: "Yüklerken hata oluştu" });
  }
});

app.get("/", (req, res) => {
  res.send("API + Socket birleşik yapı çalışıyor");
});

app.use("/active", activeStudentsRouter);
app.use("/upload", uploadRouter);
app.use("/passive", passiveStudentsRouter);
app.use("/action", actionRouter);

// 🌐 Doğru: server.listen (app.listen değil!)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor!`);
});
