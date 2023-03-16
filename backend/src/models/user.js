import { DataTypes } from "sequelize";
import { sequelize } from "../datasource.js";

export const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [4, 30],
    },
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 20],
    },
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 20],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});
