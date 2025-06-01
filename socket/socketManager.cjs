const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Room = require("../models/roomModel.cjs");
const Message = require("../models/messageModel.cjs");

const socketConnections = {}; // dışa aktarılacak

function getRoomName(senderId, receiverId) {
    return senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;
}

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

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

    return { io };
}

module.exports = {
    initSocket,
    getRoomName,
    socketConnections
};
