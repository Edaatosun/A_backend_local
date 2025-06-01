const User = require("../models/userModel.cjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  console.log(req.body.schoolNumber);
  try {
    const _findedUser = await User.findOne({
      schoolNumber: req.body.schoolNumber,
    }).exec();
    if (_findedUser && _findedUser.password == req.body.password && _findedUser.status == "aktif") {
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
    } else if (_findedUser && _findedUser.status == "aktif" && _findedUser.password != req.body.password) {
      res.status(400).json({
        msg: "Şifre hatalı.",
      });
    }else if (_findedUser && _findedUser.status == "pasif") {
      res.status(400).json({
        msg: "Lütfen 'Mezun' sayfasından giriş yapın.",
      });
    }
     else {
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
          resume: _findedUser.resume
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
  const query =  req.query.query;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: `.*${query}.*`, $options: 'i' } },
        { lastName: { $regex: `.*${query}.*`, $options: 'i' } }
      ]
    }).select('_id firstName lastName eMail classNo department status photo resume').limit(15).exec();
    if(users){
      res.status(200).json({
        users: users
      });
    }
    else{
      res.status(400).json({
        msg: "Kullanıcı Bulunamadı"
      });
    }
  } catch (error) {
    console.log("error at search user " + error);
    
  }
}

const removeResume = async(req, res, next) => {
  const userId = req.user.id;
  try {
    const _findedUser = await User.findByIdAndUpdate(userId, {
      resume: "",
    },{ new: true });
    if(_findedUser){
      res.status(200).json({
        msg: "CV başarıyla silindi.",
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
}

const removePhoto = async(req, res, next) => {
  const userId = req.user.id;
  try {
    const _findedUser = await User.findByIdAndUpdate(userId, {
      photo: "https://firebasestorage.googleapis.com/v0/b/arelnetworkstorage.firebasestorage.app/o/uploads%2Favatars%2Farel_logo.png?alt=media&token=83e0f42a-4a04-41bd-b189-dc48da6ed237",
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
}

module.exports = {
  login,
  forgotPassword,
  getUserInfo,
  searchUsers,
  removeResume,
  removePhoto
};
