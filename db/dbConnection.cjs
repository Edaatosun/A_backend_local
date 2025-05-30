const mongoose = require('mongoose');
mongoose
.connect(process.env.MONGO_URL)
  .then(() => console.log("Veri tabanına bağlandı!"))
  .catch(() => console.log("Veri tabanına bağlantı hatası!"));