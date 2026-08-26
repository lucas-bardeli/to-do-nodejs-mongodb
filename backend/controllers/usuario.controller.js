import Usuario from "../models/usuario.js";
import argon2 from "argon2";

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
}
