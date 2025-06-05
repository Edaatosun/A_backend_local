const express = require('express'); 
const actionRouter = express.Router();
const actionController = require("../controllers/actionController.cjs");
const verifyToken = require("../middlewares/verifyToken.cjs");
const multerConfigApplyingResume = require('../config/multerConfigApplyingResume.cjs');

actionRouter.get("/get/all_job",verifyToken, actionController.allJobPosts);
actionRouter.get("/get/all_intern",verifyToken, actionController.allInternPosts);
actionRouter.get("/get/all_event",verifyToken, actionController.allEventPosts);

actionRouter.post("/apply/job",verifyToken, multerConfigApplyingResume.single("resume"), actionController.applyJob);
actionRouter.post("/apply/internship",verifyToken, multerConfigApplyingResume.single("resume"), actionController.applyInternship);
actionRouter.post("/apply/event",verifyToken, actionController.applyEvent);

actionRouter.get("/check/myJob/:jobId",verifyToken, actionController.checkMyJobApplication);
actionRouter.get("/check/myIntern/:internId",verifyToken, actionController.checkMyInternApplication);
actionRouter.get("/check/myEvent/:eventId",verifyToken, actionController.checkMyEventApplication);

actionRouter.get("/get/job/:jobId",verifyToken, actionController.getJobDetails);
actionRouter.get("/get/intern/:internId",verifyToken, actionController.getInternDetails);
actionRouter.get("/get/event/:eventId",verifyToken, actionController.getEventDetails);

actionRouter.get("/search/job",verifyToken, actionController.searchJob);
actionRouter.get("/search/intern",verifyToken, actionController.searchIntern);
actionRouter.get("/search/event",verifyToken, actionController.searchEvent);

actionRouter.post("/cancel/event",verifyToken, actionController.cancelEventApplication);


actionRouter.post("/send-messages", verifyToken, actionController.sendMessage);
actionRouter.post("/join-room", verifyToken, actionController.joinRoom);
actionRouter.get("/messages/:receiverId", verifyToken, actionController.getMessages);

module.exports = actionRouter;
