const { DataTypes } = require("sequelize");
const { sequelize } = require("../datasource.js");
const { User } = require("./user.js");

const AudioFile = sequelize.define("AudioFile", {
    audio: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

AudioFile.belongsTo(User);
User.hasMany(AudioFile);