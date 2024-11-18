const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Book = require("./books");

const Rating = sequelize.define(
  "rating",

  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    grade: { type: DataTypes.INTEGER, allowNull: false },
    bookId: {
      type: DataTypes.UUID,
      references: {
        model: Book,
        key: "_id",
      },
    },
  },
  {
    tableName: "ratings",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Rating;
