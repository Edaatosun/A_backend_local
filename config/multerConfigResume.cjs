const multer = require('multer');

// Sadece PDF kabul edilir
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Sadece PDF dosyaları kabul edilir."), false);
    }
};

// Dosyayı bellekte tut
const uploadResume = multer({
    storage: multer.memoryStorage(), // diskStorage yok!
    fileFilter: pdfFileFilter
});

module.exports = uploadResume;
