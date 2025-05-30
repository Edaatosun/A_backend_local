const multer = require('multer');

// Sadece PDF dosyalarına izin ver
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Sadece PDF dosyaları kabul edilir."), false);
    }
};

const uploadResume = multer({
    storage: multer.memoryStorage(),
    fileFilter: pdfFileFilter
});

module.exports = uploadResume;
