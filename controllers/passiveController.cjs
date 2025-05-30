const User = require("../models/userModel.cjs");
const Job = require("../models/jobModel.cjs");
const Intern = require("../models/internModel.cjs");
const Event = require("../models/eventModel.cjs");
const JobApplication = require("../models/jobApplicationModel.cjs");
const InternApplication = require("../models/internApplicationModel.cjs");
const EventApplication = require("../models/eventApplicationModel.cjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const _findedUser = await User.findOne({
      tc: req.body.tc,
    }).exec();
    if (
      _findedUser &&
      _findedUser.password == req.body.password &&
      _findedUser.status == "pasif"
    ) {
      const token = jwt.sign(
        {
          id: _findedUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      console.log(token);
      res.status(200).json({
        token: token,
      });
    } else if (
      _findedUser &&
      _findedUser.status == "pasif" &&
      _findedUser.password != req.body.password
    ) {
      res.status(400).json({
        msg: "Şifre hatalı.",
      });
    } else if (_findedUser && _findedUser.status == "aktif") {
      res.status(400).json({
        msg: "Lütfen 'Öğrenci' sayfasından giriş yapın.",
      });
    } else {
      res.status(400).json({
        msg: "Üniversitemize kayıtlı değilsiniz!",
      });
    }
  } catch (error) {
    console.log("error at login " + error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const _findedUser = await User.findOne({
      tc: req.body.tc,
    }).exec();
    if (_findedUser) {
      res.status(200).json({
        user: _findedUser,
      });
    } else {
      res.status(400).json({
        msg: "Üniversitemize kayıtlı değilsiniz!",
      });
    }
  } catch (error) {
    console.log("error at forgot password " + error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const _userId = req.user.id;
    const _findedUser = await User.findById(_userId).exec();

    if (_findedUser) {
      return res.status(200).json({
        info: {
          id: _findedUser._id,
          firstName: _findedUser.firstName,
          lastName: _findedUser.lastName,
          eMail: _findedUser.eMail,
          status: _findedUser.status,
          classNo: _findedUser.classNo,
          department: _findedUser.department,
          photo: _findedUser.photo,
          resume: _findedUser.resume,
        },
      });
    } else {
      return res.status(400).json({ msg: "Kullanıcı bulunamadı" });
    }
  } catch (error) {
    console.log("error at get user info " + error);
  }
};

const searchUsers = async (req, res, next) => {
  const query = req.query.query;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: `.*${query}.*`, $options: "i" } },
        { lastName: { $regex: `.*${query}.*`, $options: "i" } },
      ],
    })
      .select(
        "_id firstName lastName eMail classNo department status photo resume"
      )
      .limit(15)
      .exec();
    if (users) {
      res.status(200).json({
        users: users,
      });
    } else {
      res.status(400).json({
        msg: "Kullanıcı Bulunamadı",
      });
    }
  } catch (error) {
    console.log("error at search user " + error);
  }
};

const removeResume = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const _findedUser = await User.findByIdAndUpdate(
      userId,
      {
        resume: "",
      },
      { new: true }
    );
    if (_findedUser) {
      res.status(200).json({
        msg: "CV başarıyla silindi.",
        user: _findedUser,
      });
    } else {
      res.status(400).json({
        msg: "Kullanıcı bulunamadı.",
      });
    }
  } catch (error) {
    console.log("error at remove resume " + error);
  }
};

const createNewJobAd = async (req, res, next) => {
  const userId = req.user.id;
  console.log("Gelen Request Body:", req.body);
  console.log("Kullanıcı ID (userId):", userId);
  try {
    const newJob = await Job.create({
      jobTitle: req.body.jobTitle,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      jobField: req.body.jobField,
      owner: userId,
    });
    if (newJob) {
      res.status(200).json({
        msg: "İş ilanı başarıyla oluşturuldu.",
        job: newJob,
      });
    } else {
      res.status(400).json({
        msg: "İş ilanı oluşturulamadı",
      });
    }
  } catch (error) {
    console.log("error at create new job " + error);
  }
};

const getMyJobAds = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const jobs = await Job.find({ owner: userId });
    if (jobs) {
      res.status(200).json({
        msg: "İş ilanları başarıyla getirildi.",
        jobs: jobs,
      });
    } else {
      res.status(400).json({
        msg: "İş ilanı yok.",
      });
    }
  } catch (error) {
    console.log("error at get my jobs " + error);
  }
};

const createNewInternAd = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const newIntern = await Intern.create({
      internTitle: req.body.internTitle,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      internField: req.body.internField,
      owner: userId,
    });
    if (newIntern) {
      res.status(200).json({
        msg: "Staj ilanı başarıyla oluşturuldu.",
        intern: newIntern,
      });
    } else {
      res.status(400).json({
        msg: "Staj ilanı oluşturulamadı",
      });
    }
  } catch (error) {
    console.log("error at create new job " + error);
  }
};

const getMyInternAds = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const interns = await Intern.find({ owner: userId });
    if (interns) {
      res.status(200).json({
        msg: "Staj ilanları başarıyla getirildi.",
        interns: interns,
      });
    } else {
      res.status(400).json({
        msg: "Staj ilanı yok.",
      });
    }
  } catch (error) {
    console.log("error at get my jobs " + error);
  }
};

const createNewEventAd = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const newEvent = await Event.create({
      eventTitle: req.body.eventTitle,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      eventField: req.body.eventField,
      owner: userId,
    });
    if (newEvent) {
      res.status(200).json({
        msg: "Etkinlik ilanı başarıyla oluşturuldu.",
        event: newEvent,
      });
    } else {
      res.status(400).json({
        msg: "Etkinlik ilanı oluşturulamadı",
      });
    }
  } catch (error) {
    console.log("error at create new event " + error);
  }
};

const getMyEventsAds = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const events = await Event.find({ owner: userId });
    if (events) {
      res.status(200).json({
        msg: "Staj ilanları başarıyla getirildi.",
        events: events,
      });
    } else {
      res.status(400).json({
        msg: "Etkinlik ilanı yok.",
      });
    }
  } catch (error) {
    console.log("error at get my event " + error);
  }
};

const getJobApplicants = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const applicants = await JobApplication.find({ job: jobId }).populate(
      "applicant",
      "firstName lastName photo resume department classNo eMail"
    );

    if (applicants) {
      res.status(200).json({
        applicants: applicants,
      });
    }
  } catch (error) {
    console.log("Error at get job applicants " + error);
  }
};

const getInternApplicants = async (req, res) => {
  const internId = req.params.internId;
  try {
    const applicants = await InternApplication.find({
      intern: internId,
    }).populate(
      "applicant",
      "firstName lastName photo resume department classNo eMail"
    );

    if (applicants) {
      res.status(200).json({
        applicants: applicants,
      });
    }
  } catch (error) {
    console.log("Error at get intern applicants " + error);
  }
};

const getEventApplicants = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const applicants = await EventApplication.find({ event: eventId }).populate(
      "applicant",
      "firstName lastName photo resume department classNo eMail"
    );

    if (applicants) {
      res.status(200).json({
        applicants: applicants,
      });
    }
  } catch (error) {
    console.log("Error at get event applicants " + error);
  }
};

const searchJobAtMyJobs = async (req, res, next) => {
  const userId = req.user.id;
  const title = req.query.title;

  try {
    const filteredJobs = await Job.find({
      owner: userId,
      jobTitle: { $regex: title, $options: "i" },
    });
    if (filteredJobs) {
      res.status(200).json({
        filteredJobs: filteredJobs,
      });
    }
  } catch (error) {
    console.log("Error at search job at my jobs " + error);
  }
};

const searchInternAtMyInterns = async (req, res, next) => {
  const userId = req.user.id;
  const title = req.query.title;

  try {
    const filteredInterns = await Intern.find({
      owner: userId,
      internTitle: { $regex: title, $options: "i" },
    });
    if (filteredInterns) {
      res.status(200).json({
        filteredInterns: filteredInterns,
      });
    }
  } catch (error) {
    console.log("Error at search intern at my interns " + error);
  }
};

const searchEventAtMyEvents = async (req, res, next) => {
  const userId = req.user.id;
  const title = req.query.title;

  try {
    const filteredEvents = await Event.find({
      owner: userId,
      eventTitle: { $regex: title, $options: "i" },
    });
    if (filteredEvents) {
      res.status(200).json({
        filteredEvents: filteredEvents,
      });
    }
  } catch (error) {
    console.log("Error at search event at my events " + error);
  }
};

const checkJobIsOwner = async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      const isOwner = job.owner.toString() === userId;
      res.status(200).json({
        isOwner: isOwner,
      });
      if (!job) {
  return res.status(404).json({ message: "İlan bulunamadı" });
}

    }
  } catch (error) {
    console.log("Error at check job is owner " + error);
  }
};

const checkInternIsOwner = async (req, res, next) => {
  const userId = req.user.id;
  const internId = req.params.internId;
  try {
    const intern = await Intern.findById(internId);
    if (intern) {
      const isOwner = intern.owner.toString() === userId;
      res.status(200).json({
        isOwner: isOwner,
      });
    }
  } catch (error) {
    console.log("Error at check intern is owner " + error);
  }
};

const checkEventIsOwner = async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;
  try {
    const event = await Event.findById(eventId);
    if (event) {
      const isOwner = event.owner.toString() === userId;
      res.status(200).json({
        isOwner: isOwner,
      });
    }
  } catch (error) {
    console.log("Error at check event is owner " + error);
  }
};

const deleteTheJob = async (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      await Job.findByIdAndDelete(jobId);
      const updatedJobs = await Job.find({
        owner: userId,
      });
      res.status(200).json({
        updatedJobs: updatedJobs,
      });
    }
  } catch (error) {
    console.log("Error at delete the job " + error);
  }
};

const deleteTheIntern = async (req, res, next) => {
  const internId = req.params.internId;
  const userId = req.user.id;
  try {
    const intern = await Intern.findById(internId);
    if (intern) {
      await Intern.findByIdAndDelete(internId);
      const updatedInterns = await Intern.find({
        owner: userId,
      });
      res.status(200).json({
        updatedInterns: updatedInterns,
      });
    }
  } catch (error) {
    console.log("Error at delete the intern " + error);
  }
};

const deleteTheEvent = async (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  try {
    const event = await Event.findById(eventId);
    if (event) {
      await Event.findByIdAndDelete(eventId);
      const updatedEvents = await Event.find({
        owner: userId,
      });
      res.status(200).json({
        updatedEvents: updatedEvents,
      });
    }
  } catch (error) {
    console.log("Error at delete the event " + error);
  }
};

const getTheJobAtMyJobsToUpdate = async (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;
  try {
    const job = await Job.find({
      owner: userId,
      _id: jobId,
    });
    if (job) {
      res.status(200).json({
        job: job,
      });
    }
  } catch (error) {
    console.log("Error at get the job at my jobs to update " + error);
  }
};

const getTheInternAtMyInternsToUpdate = async (req, res, next) => {
  const internId = req.params.internId;
  const userId = req.user.id;
  try {
    const intern = await Intern.find({
      owner: userId,
      _id: internId,
    });
    if (intern) {
      res.status(200).json({
        intern: intern,
      });
    }
  } catch (error) {
    console.log("Error at get the intern at my interns to update " + error);
  }
};

const getTheEventAtMyEventsToUpdate = async (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  try {
    const event = await Event.find({
      owner: userId,
      _id: eventId,
    });
    if (event) {
      res.status(200).json({
        event: event,
      });
    }
  } catch (error) {
    console.log("Error at get the event at my events to update  " + error);
  }
};

const updateTheJob = async (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;
  try {
    const updates = req.body;
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId, owner: userId }, updates, {
      new: true,
    });
    if(updatedJob){
      res.status(200).json({updatedJob: updatedJob });
    }
  } catch (error) {
    console.log("Error at update the job " + error);
  }
};

const updateTheIntern = async (req, res, next) => {
  const internId = req.params.internId;
  const userId = req.user.id;
  try {
    const updates = req.body;
    const updatedIntern = await Intern.findOneAndUpdate({ _id: internId, owner: userId }, updates, {
      new: true,
    });
    if(updatedIntern){
      res.status(200).json({updatedIntern: updatedIntern });
    }
  } catch (error) {
    console.log("Error at update the intern " + error);
  }
};

const updateTheEvent = async (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  try {
    const updates = req.body;
    const updatedEvent = await Event.findOneAndUpdate({ _id: eventId, owner: userId }, updates, {
      new: true,
    });
    if(updatedEvent){
      res.status(200).json({updatedEvent: updatedEvent });
    }
  } catch (error) {
    console.log("Error at update the event " + error);
  }
};


const removePhoto = async(req, res, next) => {
  const userId = req.user.id;
  try {
    const _findedUser = await User.findByIdAndUpdate(userId, {
      photo: "https://bitirme-projesi-17w9.onrender.com/uploads/avatars/arel_logo.png",
    },{ new: true });
    if(_findedUser){
      res.status(200).json({
        msg: "Fotoğraf başarıyla silindi.",
        user: _findedUser
      });
    }else{
      res.status(400).json({
        msg: "Kullanıcı bulunamadı."
      });
    }
  } catch (error) {
    console.log("error at remove resume " + error);
  }
};

module.exports = {
  login,
  forgotPassword,
  searchUsers,
  getUserInfo,

  createNewJobAd,
  getMyJobAds,
  createNewInternAd,
  getMyInternAds,
  createNewEventAd,
  getMyEventsAds,

  getJobApplicants,
  getInternApplicants,
  getEventApplicants,

  searchJobAtMyJobs,
  searchInternAtMyInterns,
  searchEventAtMyEvents,

  checkJobIsOwner,
  checkInternIsOwner,
  checkEventIsOwner,

  deleteTheJob,
  deleteTheIntern,
  deleteTheEvent,

  getTheJobAtMyJobsToUpdate,
  getTheInternAtMyInternsToUpdate,
  getTheEventAtMyEventsToUpdate,

  updateTheJob,
  updateTheIntern,
  updateTheEvent,

  removeResume,
  removePhoto,
};
