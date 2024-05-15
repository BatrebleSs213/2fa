const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/2fa");

const db = mongoose.connection;

db.on("error", (err) => {
    console.error(`Ошибка базы данных: ${err.message}`);
    process.exit(1);
});

db.once("open", () => {
    console.log("Подключение к базе данных успешно");
});

require("./models");
