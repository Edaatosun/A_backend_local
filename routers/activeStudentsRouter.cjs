const express = require('express'); 
const activeStudentsRouter = express.Router();
const activeController = require("../controllers/activeController.cjs");
const verifyToken = require("../middlewares/verifyToken.cjs");

activeStudentsRouter.post("/login", activeController.login);
activeStudentsRouter.post("/forgotPassword", activeController.forgotPassword);
activeStudentsRouter.get("/me", verifyToken, activeController.getUserInfo);
activeStudentsRouter.get("/search",verifyToken, activeController.searchUsers);
activeStudentsRouter.get("/remove/resume",verifyToken, activeController.removeResume);
activeStudentsRouter.get("/remove/photo",verifyToken, activeController.removePhoto);


module.exports = activeStudentsRouter;
