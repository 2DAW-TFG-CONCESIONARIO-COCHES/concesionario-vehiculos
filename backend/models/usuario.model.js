const { DataTypes } = require("sequelize")
const sequelize = require("../config/db.config")
const bcrypt = require("bcryptjs")

const Usuario = sequelize.define(
  "Usuario",
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
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("admin", "empleado"),
      defaultValue: "empleado",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10)
          usuario.password = await bcrypt.hash(usuario.password, salt)
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10)
          usuario.password = await bcrypt.hash(usuario.password, salt)
        }
      },
    },
  },
)

// Método para comparar contraseñas
Usuario.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = Usuario
