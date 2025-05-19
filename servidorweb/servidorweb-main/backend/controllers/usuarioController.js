const { body, param, validationResult } = require("express-validator");
const Usuario = require("../models/usuario");
const sequelize = require("../config/database"); // Importa sequelize
const nodemailer = require("nodemailer");

async function enviarCodigo(req, res) {
  const { email, codigo } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "soporteelrincondelcinefilo@gmail.com",
      pass: "uhnh ddtp kgsz nkjv",
    },
  });

  const mailOptions = {
    from: "soporteelrincondelcinefilo@gmail.com",
    to: email,
    subject: "Código de verificación",
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background-color: #1c1c1c; padding: 30px; border-radius: 10px; color: #ffffff; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
    <h2 style="color: #e50914; text-align: center;">🎬 El Rincón del Cinéfilo</h2>
    <p style="font-size: 16px;">
      Hemos detectado un intento de registro en nuestra plataforma. Si no has solicitado este registro, puedes ignorar este correo. <br><br>
      Si fuiste tú, por favor <strong>verifica tu cuenta</strong> usando el siguiente código:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background-color: #e50914; padding: 20px 40px; font-size: 32px; font-weight: bold; color: white; border-radius: 8px; letter-spacing: 4px;">
        ${codigo}
      </div>
    </div>
    <p style="font-size: 14px; color: #cccccc;">
      Este código es válido solo por unos minutos. No compartas este correo con nadie. <br><br>
      ¡Gracias por confiar en nosotros!
    </p>
    <p style="text-align: center; font-size: 12px; color: #777;">© 2025 El Rincón del Cinéfilo</p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
}

module.exports = {
  // Obtener todos los usuarios
  async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error en el servidor",
      });
    }
  },

  // Obtener un usuario por nombre con validación
  async getUsuario(req, res) {
    try {
      const { nombre } = req.params;
      const usuario = await Usuario.findOne({
        where: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("nombre")),
          nombre.toLowerCase()
        ),
      });
      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }
      res.json(usuario);
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      res.status(500).json({
        message: "Error en el servidor",
      });
    }
  },

  // Obtener un usuario por email
  async getUsuarioPorEmail(req, res) {
    try {
      const { email } = req.params;
      const usuario = await Usuario.findOne({
        where: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          email.toLowerCase()
        ),
      });

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      res.json(usuario);
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      res.status(500).json({
        message: "Error en el servidor",
      });
    }
  },

  // Eliminar un usuario por nombre con validación
  async deleteUsuario(req, res) {
    try {
      await param("nombre").isString().withMessage("Nombre inválido").run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre } = req.params;
      const usuario = await Usuario.findOne({
        where: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("nombre")),
          nombre.toLowerCase()
        ),
      });
      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }
      await usuario.destroy();
      res.json({
        message: "Usuario eliminado",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error en el servidor",
      });
    }
  },

  // Crear un nuevo usuario con validación y sanitización
  async createUser(req, res) {
    try {
      await Promise.all([
        body("nombre")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Nombre es requerido")
          .run(req),
        body("email").isEmail().withMessage("Email inválido").run(req),
        body("password")
          .isLength({ min: 8, max: 20 })
          .withMessage("Contraseña debe tener entre 8 y 20 caracteres")
          .run(req),
        body("imagenPerfil").optional().run(req), // Validación para imagenPerfil
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, email, password, imagenPerfil } = req.body;
      const usuario = await Usuario.create({
        nombre,
        email,
        password,
        imagenPerfil,
      });
      res.status(201).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  },

  // Actualizar un usuario por ID con validación y manejo de imágenes
  async updateUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, password, imagenPerfil, imagenCabecera } =
        req.body;

      // Buscar el usuario en la base de datos
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Actualizar los datos del usuario
      if (nombre) usuario.nombre = nombre;
      if (email) usuario.email = email;
      if (password) usuario.password = password;
      if (imagenPerfil) usuario.imagenPerfil = imagenPerfil;
      if (imagenCabecera) usuario.imagenCabecera = imagenCabecera;

      await usuario.save();

      res.json({ message: "Usuario actualizado correctamente", usuario });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Autenticar un usuario con validación
  async loginUser(req, res) {
    try {
      await Promise.all([
        body("email").isEmail().withMessage("Email inválido").run(req),
        body("password")
          .isLength({ min: 8, max: 20 })
          .withMessage("Contraseña debe tener entre 8 y 20 caracteres")
          .run(req),
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario || usuario.password !== password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      req.session.user = {
        id: usuario.ID,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      };

      res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Cerrar sesión de un usuario
  async logoutUser(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ message: "No estás autenticado" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  },

  // Cambiar el rol de un usuario
  async cambiarRol(req, res) {
    try {
      await param("id").isInt().withMessage("ID inválido").run(req);
      await body("rol")
        .isIn(["admin", "estandar"])
        .withMessage("Rol inválido")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { rol } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      usuario.rol = rol;
      await usuario.save();

      res.json({ message: "Rol actualizado", usuario });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Activar/Desactivar cuenta
  async cambiarEstado(req, res) {
    try {
      await param("id").isInt().withMessage("ID inválido").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      usuario.estado = usuario.estado === "activo" ? "inactivo" : "activo";
      await usuario.save();

      res.json({ message: "Estado actualizado", usuario });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Eliminar usuario
  async eliminarUsuario(req, res) {
    try {
      await param("id").isInt().withMessage("ID inválido").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      await usuario.destroy();

      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Obtener sesión de usuario
  async getSession(req, res) {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: "No hay sesión activa" });
    }
  },

  enviarCodigo,
};
