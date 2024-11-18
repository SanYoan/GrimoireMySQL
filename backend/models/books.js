const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Book = sequelize.define(
  "Book",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    averageRating: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    tableName: "books",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Book;
