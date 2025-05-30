const express = require('express'); 
const uploadRouter = express.Router();
const uploadController = require("../controllers/uploadController.cjs");
const verifyToken = require("../middlewares/verifyToken.cjs");
const multerConfigPhoto = require('../config/multerConfigPhoto.cjs');
const multerConfigResume = require('../config/multerConfigResume.cjs');

uploadRouter.post("/photo", verifyToken, multerConfigPhoto.single("photo"), uploadController.uploadPhoto);
uploadRouter.post("/resume", verifyToken ,multerConfigResume.single("resume"), uploadController.uploadResume);

module.exports = uploadRouter;