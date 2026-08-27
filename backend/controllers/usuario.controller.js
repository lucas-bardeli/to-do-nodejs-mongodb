import Usuario from "../models/usuario.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export default class UsuarioController {
  static async registrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const hashPassword = await argon2.hash(senha);

      const usuario = new Usuario({
        nome,
        email,
        senha: hashPassword,
      });

      const novoUsuario = await usuario.save();

      return res
        .status(200)
        .json({ message: "Usuário cadastrado com sucesso.", novoUsuario });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao cadastrar usuário.", error });
    }
  }

  static async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const usuario = await Usuario.findOne({ email }).select("+senha");

      if (!usuario)
        return res.status(400).json({ message: "Credenciais inválidas." });

      const senhaValida = await argon2.verify(usuario.senha, senha);

      if (!senhaValida)
        return res.status(400).json({ message: "Credenciais inválidas." });

      const tokenPayload = {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true, // Evita acesso por scrits JavaScript
        secure: false, // Tornar true em produção, exige https
        sameSite: "lax", // Comunicação entre front e back
        maxAge: process.env.JWT_EXPIRATION_MS || 3600000, // 1h
      });

      return res.status(200).json({
        message: "Login realizado com sucesso.",
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
        },
        token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao realizar o login.", error });
    }
  }
}
