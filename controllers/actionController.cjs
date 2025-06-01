const User = require("../models/userModel.cjs");
const Job = require("../models/jobModel.cjs");
const jwt = require("jsonwebtoken");
const JobApplication = require("../models/jobApplicationModel.cjs");
const InternApplication = require("../models/internApplicationModel.cjs");
const EventApplication = require("../models/eventApplicationModel.cjs");
const Intern = require("../models/internModel.cjs");
const Event = require("../models/eventModel.cjs");
const path = require('path');
const { format } = require('util');
const bucket = require('../firebase/firebaseService.cjs');
const Room = require("../models/roomModel.cjs");
const Message = require("../models/messageModel.cjs");
const { socketConnections } = require("../socket/socketManager.cjs");

const allJobPosts = async (req, res, next) => {
  try {
    const jobs = await Job.find();
    if (jobs) {
      return res.status(200).json({
        jobs: jobs,
      });
    } else {
      return res.status(200).json({
        msg: "İş İlanı Yok.",
      });
    }
  } catch (error) {
    console.error("error at all job posts " + error);
  }
};

const checkMyJobApplication = async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  console.log(jobId);

  try {
    const application = await JobApplication.findOne({
      applicant: userId,
      job: jobId,
    });
    if (application) {
      return res.status(200).json({
        message: "Başvuru yapılmış.",
        resume: application.resume,
      });
      if (!application) {
        return res.status(404).json({ message: "Başvuru bulunamadı." });
      }

    }
  } catch (error) {
    console.log("error at check my job application:", error);
  }
};

const applyJob = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ msg: "Özgeçmiş yüklenmedi." });
  }

  try {
    const fileExtension = path.extname(req.file.originalname); // .pdf
    const uniqueName = `${userId}_${Date.now()}${fileExtension}`;
    const filename = `uploads/applying_resumes/${uniqueName}`;
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
        await file.makePublic();
        const resumeUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename}`);

        const newApplication = await JobApplication.create({
          job: req.body._id,
          applicant: userId,
          resume: resumeUrl,
        });

        if (newApplication) {
          return res.status(200).json({
            msg: "Başvuru Başarılı.",
            resume: resumeUrl,
          });
        } else {
          return res.status(400).json({ msg: "Başvuru yapılamadı." });
        }

      } catch (error) {
        console.error("📛 Veritabanı hatası:", error);
        return res.status(500).json({ msg: "Başvuru işlemi sırasında hata oluştu." });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("📛 Genel hata:", error);
    return res.status(500).json({ msg: "Sunucu hatası." });
  }
};

const searchJob = (async (req, res) => {
  try {
    const { location, company, jobField, jobTitle } = req.query;

    let filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (company) filter.company = { $regex: company, $options: "i" };
    if (jobField) filter.jobField = { $regex: jobField, $options: "i" };
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };


    const jobs = await Job.find(filter);
    if (jobs) {
      return res.status(200).json({ jobs: jobs });
    }
  } catch (error) {
    console.log("error at search job:", error);
  }
});

const searchIntern = (async (req, res) => {
  try {
    const { location, company, internField, internTitle } = req.query;

    let filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (company) filter.company = { $regex: company, $options: "i" };
    if (internField) filter.internField = { $regex: internField, $options: "i" };
    if (internTitle) filter.internTitle = { $regex: internTitle, $options: "i" };


    const interns = await Intern.find(filter);
    if (interns) {
      return res.status(200).json({ interns: interns });
    }
  } catch (error) {
    console.log("error at search internship:", error);
  }
});

const allInternPosts = async (req, res, next) => {
  try {
    const interns = await Intern.find();
    if (interns) {
      return res.status(200).json({
        interns: interns,
      });
    } else {
      return res.status(200).json({
        msg: "Staj İlanı Yok.",
      });
    }
  } catch (error) {
    console.error("error at all intern posts " + error);
  }
};
const applyInternship = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ msg: "Özgeçmiş yüklenmedi." });
  }

  try {
    const fileExtension = path.extname(req.file.originalname);
    const uniqueName = `${userId}_${Date.now()}${fileExtension}`;
    const filename = `uploads/applying_resumes/${uniqueName}`;
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
        await file.makePublic();
        const resumeUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename}`);

        const newApplication = await InternApplication.create({
          intern: req.body._id,
          applicant: userId,
          resume: resumeUrl,
        });

        if (newApplication) {
          return res.status(200).json({
            msg: "Başvuru Başarılı.",
            resume: resumeUrl,
          });
        } else {
          return res.status(400).json({ msg: "Başvuru yapılamadı." });
        }

      } catch (error) {
        console.error("📛 Veritabanı hatası:", error);
        return res.status(500).json({ msg: "Veritabanı işlemi sırasında hata oluştu." });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("📛 Genel hata:", error);
    return res.status(500).json({ msg: "Sunucu hatası." });
  }
};

const checkMyInternApplication = async (req, res, next) => {
  const userId = req.user.id;
  const internId = req.params.internId;

  try {
    const application = await InternApplication.findOne({
      applicant: userId,
      intern: internId,
    });
    if (application) {

      return res.status(200).json({
        message: "Başvuru yapılmış.",
        resume: application.resume,
      });
    }
  } catch (error) {
    console.log("error at check my intern application:", error);
  }
};

const searchEvent = (async (req, res) => {
  try {
    const { location, company, eventField, eventTitle } = req.query;

    let filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (company) filter.company = { $regex: company, $options: "i" };
    if (eventField) filter.eventField = { $regex: eventField, $options: "i" };
    if (eventTitle) filter.eventTitle = { $regex: eventTitle, $options: "i" };


    const events = await Event.find(filter);
    if (events) {
      return res.status(200).json({ events: events });
    }
  } catch (error) {
    console.log("error at search event:", error);
  }
});

const allEventPosts = async (req, res, next) => {
  try {
    const events = await Event.find();
    if (events) {
      return res.status(200).json({
        events: events,
      });
    } else {
      return res.status(200).json({
        msg: "Etkinlik İlanı Yok.",
      });
    }
  } catch (error) {
    console.error("error at all event posts " + error);
  }
};

const applyEvent = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const newApplication = await EventApplication.create({
      event: req.body._id,
      applicant: userId,
    });

    if (newApplication) {
      return res.status(200).json({
        msg: "Başvuru Başarılı.",
        application: true,
      });
    } else {
      return res.status(400).json({ msg: "Başvuru yapılamadı." });
    }
  } catch (error) {
    console.log("error at apply event:", error);
  }
};

const checkMyEventApplication = async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;

  try {
    const application = await EventApplication.findOne({
      applicant: userId,
      event: eventId,
    });
    if (application) {
      return res.status(200).json({
        message: "Başvuru yapılmış.",
        application: true
      });
    }
  } catch (error) {
    console.log("error at check my event application:", error);
  }
};

const cancelEventApplication = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const deletedApplication = await EventApplication.findOneAndDelete({
      event: req.body._id,
      applicant: userId,
    });

    if (deletedApplication) {
      return res.status(200).json({
        msg: "Başvuru başarıyla iptal edildi.",
        application: false,
      });
    } else {
      return res.status(400).json({
        msg: "Başvuru bulunamadı.",
      });
    }
  } catch (error) {
    console.error("error at cancel event application:", error);
  }
};

const getJobDetails = async (req, res) => {
  const jobId = req.params.jobId;
  console.log(jobId);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "İş ilanı bulunamadı." });
    }

    res.status(200).json({
      job: job,
    });
  } catch (error) {
    console.error("Error at getJobDetails:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


const getInternDetails = async (req, res) => {
  const internId = req.params.internId;
  try {
    const intern = await Intern.findById(internId);

    if (!intern) {
      return res.status(404).json({ message: "Staj ilanı bulunamadı." });
    }

    res.status(200).json({
      intern: intern,
    });
  } catch (error) {
    console.error("Error at getInternDetails:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getEventDetails = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Etkinlik ilanı bulunamadı." });
    }

    res.status(200).json({
      event: event,
    });
  } catch (error) {
    console.error("Error at getEventDetails:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Oda ismi oluşturucu
function getRoomName(senderId, receiverId) {
  return senderId < receiverId
    ? `${senderId}-${receiverId}`
    : `${receiverId}-${senderId}`;
}

const sendMessage = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token gerekli" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender_id = decoded.id;
    const { receiver_id, message } = req.body;

    const roomName = getRoomName(sender_id, receiver_id);

    let room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    const newMessage = new Message({
      room: room._id,
      sender_id,
      receiver_id,
      message,
    });

    await newMessage.save();

    const receiverSocket = socketConnections[receiver_id];
    if (receiverSocket) {
      receiverSocket.emit("receiveMessage", {
        _id: newMessage._id,
        room: room._id,
        sender_id,
        receiver_id,
        message,
        createdAt: newMessage.createdAt,
        isRead: newMessage.isRead,
      });
    }


    res.status(200).json({ message: "Mesaj gönderildi" });
  } catch (error) {
    console.error("Mesaj gönderilirken hata:", error.message);
    res.status(500).json({ error: "Gönderim hatası" });
  }
};

const joinRoom = async (req, res) => {
  const sender_id = req.user.id;
  const { receiver_id } = req.body;

  try {
    const roomName = getRoomName(sender_id, receiver_id);

    let room = await Room.findOne({ roomName });

    if (!room) {
      room = await Room.create({
        roomName,
        participants: [sender_id, receiver_id],
      });
      console.log(`🆕 Yeni oda oluşturuldu: ${roomName}`);
    }

    return res.status(200).json({
      msg: "Odaya katılım sağlandı",
      room,
    });
  } catch (error) {
    console.error("Odaya katılma hatası:", error);
    res.status(500).json({ error: "Katılım başarısız" });
  }
};

const getMessages = async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.params.receiver_id;

  try {
    const roomName = getRoomName(sender_id, receiver_id);

    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    const messages = await Message.find({ room: room._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      room: roomName,
      messages,
    });
  } catch (error) {
    console.error("Mesajları getirirken hata:", error);
    res.status(500).json({ error: "Mesajlar alınamadı" });
  }
};

module.exports = {
  checkMyJobApplication,
  allJobPosts,
  applyJob,
  searchJob,
  searchIntern,
  allInternPosts,
  applyInternship,
  checkMyInternApplication,
  searchEvent,
  allEventPosts,
  applyEvent,
  checkMyEventApplication,
  cancelEventApplication,
  getJobDetails,
  getInternDetails,
  getEventDetails,
  sendMessage,
  getMessages,
  joinRoom,

};
