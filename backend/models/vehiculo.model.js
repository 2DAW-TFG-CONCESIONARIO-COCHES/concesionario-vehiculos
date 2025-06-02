const { DataTypes } = require("sequelize")
const sequelize = require("../config/db.config")

const Vehiculo = sequelize.define(
  "Vehiculo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    kilometraje: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    combustible: {
      type: DataTypes.ENUM("gasolina", "diesel", "electrico", "hibrido"),
      allowNull: false,
    },
    transmision: {
      type: DataTypes.ENUM("manual", "automatica"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("nuevo", "usado", "vendido"),
      defaultValue: "nuevo",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagenes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    modeloId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Modelos",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = Vehiculo
