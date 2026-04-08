/**
 * auth.js — Autenticação simulada (apenas para fins educacionais)
 *
 * AVISO: Em produção real, NUNCA armazene senhas em texto no front-end.
 * A autenticação deve ser feita no servidor com hash seguro (bcrypt, etc.).
 * Este módulo existe apenas para demonstrar o fluxo de login/logout
 * com papéis distintos (cliente × barbeiro) em ambiente de aprendizado.
 */

var Auth = (function () {
  "use strict";

  var KEY_SESSAO = "barbearia_sessao";

  // Credenciais fixas para demonstração educacional
  var USUARIOS = [
    { usuario: "cliente",  senha: "cliente123",  papel: "cliente",  nome: "Cliente" },
    { usuario: "barbeiro", senha: "barbeiro123", papel: "barbeiro", nome: "Barbeiro" },
  ];

  /**
   * Tenta autenticar com as credenciais fornecidas.
   * @param {string} usuario
   * @param {string} senha
   * @returns {{ ok: boolean, usuario?: object, erro?: string }}
   */
  function login(usuario, senha) {
    if (!usuario || !senha) {
      return { ok: false, erro: "Preencha usuário e senha." };
    }
    var encontrado = USUARIOS.find(function (u) {
      return u.usuario === usuario.trim().toLowerCase() && u.senha === senha;
    });
    if (!encontrado) {
      return { ok: false, erro: "Usuário ou senha incorretos." };
    }
    var sessao = { usuario: encontrado.usuario, papel: encontrado.papel, nome: encontrado.nome };
    sessionStorage.setItem(KEY_SESSAO, JSON.stringify(sessao));
    return { ok: true, usuario: sessao };
  }

  /**
   * Encerra a sessão atual e limpa o sessionStorage.
   */
  function logout() {
    sessionStorage.removeItem(KEY_SESSAO);
  }

  /**
   * Retorna o objeto de sessão atual ou null se não houver sessão.
   * @returns {object|null}
   */
  function getSessao() {
    try {
      var raw = sessionStorage.getItem(KEY_SESSAO);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Verifica se há uma sessão ativa.
   * @returns {boolean}
   */
  function estaLogado() {
    return getSessao() !== null;
  }

  return { login: login, logout: logout, getSessao: getSessao, estaLogado: estaLogado };
})();
