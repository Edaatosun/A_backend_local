const multer = require('multer');
const path = require('path');

// Sadece .jpeg ve .png uzantılı dosyaları kabul et
const imgFileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Sadece JPEG ve PNG dosyaları kabul edilir."), false);
    }
};

// Firebase için bellek üzerinde tutulacak dosya ayarı
const myStorage = multer.memoryStorage();

const uploadPhoto = multer({
    storage: myStorage,
    fileFilter: imgFileFilter
});

module.exports = uploadPhoto;
