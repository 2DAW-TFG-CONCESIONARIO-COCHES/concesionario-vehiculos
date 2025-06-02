const { DataTypes } = require("sequelize")
const sequelize = require("../config/db.config")

const Modelo = sequelize.define(
  "Modelo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("sedan", "suv", "hatchback", "pickup", "deportivo", "otro"),
      defaultValue: "otro",
    },
    marcaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Marcas",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = Modelo
