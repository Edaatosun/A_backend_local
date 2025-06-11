const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bitirmeprojesi30@gmail.com",      
    pass: "mkyk swyd qzyl cnat",  
  },
});

const sendMail = async (toEmail, password) => {
  try {
    const mailOptions = {
      from: '"Arel Network" <Arel.edu.tr>', 
      to: toEmail,                                 
      subject:"Şifre Bilgilendirme",                            
      text: `Sayın kullanıcı, uygulama şifreniz: ${password}`,  
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Mail gönderildi:", info.messageId);
    return true;
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return false;
  }
};

module.exports = sendMail;