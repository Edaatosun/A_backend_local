const dotenv = require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require('path');

// Veritabanı ve modeller
require("../db/dbConnection.cjs");
const User = require("../models/userModel.cjs");
const Room = require("../models/roomModel.cjs");
const Message = require("../models/messageModel.cjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket bağlantılarını takip etmek için (userId -> socket)
const socketConnections = {};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Oda ismini belirleyen fonksiyon
function getRoomName(senderId, receiverId) {
    return senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;
}

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

    // Kullanıcı disconnect olursa bağlantı listesinden çıkar
    socket.on("disconnect", () => {
        if (socket.user && socketConnections[socket.user.id]) {
            delete socketConnections[socket.user.id];
            console.log(`🔴 Kullanıcı ayrıldı: ${socket.user.id}`);
        }
    });
});


app.post("/messages/send", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token gerekli" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sender_id = decoded.id; // Token'dan alındı
        const { receiver_id, message } = req.body;
        const roomName = getRoomName(sender_id, receiver_id);

        let room = await Room.findOne({ roomName });
        if (!room) {
            return res.status(404).json({ error: "Oda bulunamadı" });
        }

        const newMessage = new Message({
            room: room._id,
            sender_id,
            receiver_id,
            message,
        });
        await newMessage.save();

        const receiverSocket = socketConnections[receiver_id];
        if (receiverSocket) {
            receiverSocket.to(roomName).emit("receiveMessage", {
                _id: newMessage._id,
                room: room._id,
                sender_id,
                receiver_id,
                message,
                createdAt: newMessage.createdAt,
                isRead: newMessage.isRead,
            });
        }

        res.status(200).json({ message: "Mesaj gönderildi" });
    } catch (error) {
        console.error("Mesaj gönderilirken hata:", error);
        res.status(500).json({ error: "Gönderim hatası" });
    }
});


// 📥 REST Endpoint: Odaya katıl
app.post("/messages/join", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token gerekli" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sender_id = decoded.id;
        const { receiver_id } = req.body;
        const roomName = getRoomName(sender_id, receiver_id);
        const senderSocket = socketConnections[sender_id];

        if (!senderSocket) {
            return res.status(400).json({ error: "Kullanıcı socket'e bağlı değil" });
        }

        senderSocket.join(roomName);
        console.log(`🔔 Kullanıcı ${sender_id} odası ${roomName}’a katıldı`);

        let room = await Room.findOne({ roomName });
        if (!room) {
            room = await Room.create({
                roomName,
                participants: [sender_id, receiver_id],
            });
            console.log(`💾 Yeni oda oluşturuldu: ${roomName}`);
        }

        res.status(200).json({ message: "Odaya katıldı", room });
    } catch (err) {
        console.error("Katılım hatası:", err);
        res.status(500).json({ error: "Odaya katılamadı" });
    }
});


app.get("/messages/:receiver_id", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token gerekli" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sender_id = decoded.id;
        const receiver_id = req.params.receiver_id;
        const roomName = getRoomName(sender_id, receiver_id);

        const room = await Room.findOne({ roomName });
        if (!room) {
            return res.status(404).json({ error: "Oda bulunamadı" });
        }

        const messages = await Message.find({ room: room._id })
            .sort({ createdAt: 1 });

        res.status(200).json({ room: roomName, messages });
    } catch (err) {
        console.error("Mesajlar alınamadı:", err);
        res.status(500).json({ error: "Mesajlar alınamadı" });
    }
});

app.get("/", (req, res) => {
  res.send("socket API'si çalışıyor");
});




const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Socket sunucusu ${PORT} portunda çalışıyor...`);
});
