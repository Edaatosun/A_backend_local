const express = require('express'); 
const passiveStudentsRouter = express.Router();
const passiveController = require("../controllers/passiveController.cjs");
const verifyToken = require("../middlewares/verifyToken.cjs");

passiveStudentsRouter.post("/login", passiveController.login);
passiveStudentsRouter.post("/forgotPassword", passiveController.forgotPassword);
passiveStudentsRouter.get("/me", verifyToken, passiveController.getUserInfo);
passiveStudentsRouter.get("/search",verifyToken, passiveController.searchUsers);

passiveStudentsRouter.post("/create/jobAd",verifyToken, passiveController.createNewJobAd);
passiveStudentsRouter.post("/create/internAd",verifyToken, passiveController.createNewInternAd);
passiveStudentsRouter.post("/create/eventAd",verifyToken, passiveController.createNewEventAd);

passiveStudentsRouter.get("/get/myJobAds",verifyToken, passiveController.getMyJobAds);
passiveStudentsRouter.get("/get/myInternAds",verifyToken, passiveController.getMyInternAds);
passiveStudentsRouter.get("/get/myEventAds",verifyToken, passiveController.getMyEventsAds);

passiveStudentsRouter.get("/get/job/:jobId/applicants",verifyToken, passiveController.getJobApplicants);
passiveStudentsRouter.get("/get/intern/:internId/applicants",verifyToken, passiveController.getInternApplicants);
passiveStudentsRouter.get("/get/event/:eventId/applicants",verifyToken, passiveController.getEventApplicants);

passiveStudentsRouter.get("/search/at/myjobs", verifyToken, passiveController.searchJobAtMyJobs);
passiveStudentsRouter.get("/search/at/myinterns", verifyToken, passiveController.searchInternAtMyInterns);
passiveStudentsRouter.get("/search/at/myevents", verifyToken, passiveController.searchEventAtMyEvents);

passiveStudentsRouter.get("/jobs/:jobId/isOwner", verifyToken, passiveController.checkJobIsOwner);
passiveStudentsRouter.get("/interns/:internId/isOwner", verifyToken, passiveController.checkInternIsOwner);
passiveStudentsRouter.get("/events/:eventId/isOwner", verifyToken, passiveController.checkEventIsOwner);

passiveStudentsRouter.delete("/job/:jobId", verifyToken, passiveController.deleteTheJob);
passiveStudentsRouter.delete("/intern/:internId", verifyToken, passiveController.deleteTheIntern);
passiveStudentsRouter.delete("/event/:eventId", verifyToken, passiveController.deleteTheEvent);

passiveStudentsRouter.get("/update/job/:jobId", verifyToken, passiveController.getTheJobAtMyJobsToUpdate);
passiveStudentsRouter.get("/update/intern/:internId", verifyToken, passiveController.getTheInternAtMyInternsToUpdate);
passiveStudentsRouter.get("/update/event/:eventId", verifyToken, passiveController.getTheEventAtMyEventsToUpdate);

passiveStudentsRouter.post("/update/job/:jobId", verifyToken, passiveController.updateTheJob);
passiveStudentsRouter.post("/update/intern/:internId", verifyToken, passiveController.updateTheIntern);
passiveStudentsRouter.post("/update/event/:eventId", verifyToken, passiveController.updateTheEvent);


passiveStudentsRouter.get("/remove/resume",verifyToken, passiveController.removeResume);
passiveStudentsRouter.get("/remove/photo",verifyToken, passiveController.removePhoto);

module.exports = passiveStudentsRouter;
