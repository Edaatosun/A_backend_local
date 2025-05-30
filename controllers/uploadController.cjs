const User = require("../models/userModel.cjs");
const path = require('path');
const { format } = require('util');
const bucket = require('../firebase/firebaseService.cjs'); // Firebase bucket import
const uploadResume = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Dosya bulunamadı." });
    }

    const fileExtension = path.extname(req.file.originalname); // .pdf
    const filename = `uploads/resumes/${userId}${fileExtension}`;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error("📛 Yükleme hatası:", err);
      return res.status(500).json({ msg: "Yükleme sırasında hata oluştu." });
    });

    stream.on('finish', async () => {
      try {
        await file.makePublic(); // Dosyayı herkese açık yap

        const resumeUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename}`);

        const updatedUser = await User.findByIdAndUpdate(userId, { resume: resumeUrl });

        if (!updatedUser) {
          return res.status(400).json({ msg: "Kullanıcı bulunamadı." });
        }

        console.log("✅ CV yüklendi:", resumeUrl);
        return res.status(200).json({
          msg: "CV başarıyla yüklendi.",
          resumeUrl,
        });

      } catch (error) {
        console.error("📛 Veritabanı güncellenemedi:", error);
        return res.status(500).json({ msg: "CV yüklendi ama veritabanı güncellenemedi." });
      }
    });

    stream.end(req.file.buffer); // Dosyayı Firebase'e gönder

  } catch (error) {
    console.error("📛 Genel hata:", error);
    return res.status(500).json({ msg: "Sunucu hatası." });
  }
};


const uploadPhoto = async (req, res) => {
  const userId = req.user.id;
  console.log("📥 Fotoğraf yükleme işlemi başladı");

  if (!req.file) {
    return res.status(400).json({ msg: "Dosya bulunamadı." });
  }

  try {
    const fileExtension = path.extname(req.file.originalname);
    const filename = `uploads/avatars/${userId}${fileExtension}`;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error("📛 Firebase yükleme hatası:", err);
      return res.status(500).json({ msg: "Yükleme sırasında hata oluştu." });
    });

    stream.on('finish', async () => {
      try {
        await file.makePublic();

        // Her seferinde benzersiz URL oluşturur
        const timestamp = Date.now();
        const photoUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename}?t=${timestamp}`);

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { photo: photoUrl },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(400).json({ msg: "Kullanıcı bulunamadı." });
        }

        console.log("✅ Fotoğraf başarıyla yüklendi:", photoUrl);
        return res.status(200).json({
          msg: "Fotoğraf başarıyla yüklendi.",
          photoUrl,
        });

      } catch (error) {
        console.error("📛 Veritabanı güncelleme hatası:", error);
        return res.status(500).json({ msg: "Fotoğraf yüklendi ama veritabanı güncellenemedi." });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("📛 Genel hata:", error);
    return res.status(500).json({ msg: "Sunucu hatası." });
  }
};

module.exports = {
  uploadPhoto,
  uploadResume,
};
