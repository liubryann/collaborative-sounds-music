import { DataTypes } from "sequelize";
import { sequelize } from "../datasource.js";

export const Composition = sequelize.define("Composition", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 30],
    },
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 30],
    },
  },
});
