/**
 * app.js — Orquestrador principal da aplicação
 *
 * Responsabilidades:
 * - Controlar o fluxo de login e logout
 * - Exibir o painel correto conforme o papel do usuário (cliente × barbeiro)
 * - Inicializar os módulos de UI após autenticação
 */

(function () {
  "use strict";

  // ——— Elementos do DOM ———
  var telaLogin        = document.getElementById("tela-login");
  var appPrincipal     = document.getElementById("app");
  var painelCliente    = document.getElementById("painel-cliente");
  var painelBarbeiro   = document.getElementById("painel-barbeiro");
  var badgePapel       = document.getElementById("badge-papel");
  var nomeUsuarioLogado = document.getElementById("nome-usuario-logado");
  var btnLogout        = document.getElementById("btn-logout");

  // Formulário de login
  var formLogin        = document.getElementById("form-login");
  var inputUsuario     = document.getElementById("login-usuario");
  var inputSenha       = document.getElementById("login-senha");
  var erroLoginUsuario = document.getElementById("erro-login-usuario");
  var erroLoginSenha   = document.getElementById("erro-login-senha");
  var feedbackLogin    = document.getElementById("feedback-login");

  // Política de privacidade no rodapé
  var linkPolitica     = document.getElementById("link-politica");
  var textoPolitica    = document.getElementById("politica");

  // ——— Controle de visibilidade ———

  function mostrarTelaLogin() {
    telaLogin.hidden = false;
    appPrincipal.hidden = true;
    painelCliente.hidden = true;
    painelBarbeiro.hidden = true;
    painelCliente.classList.remove("ativo");
    painelBarbeiro.classList.remove("ativo");
  }

  function mostrarApp(sessao) {
    telaLogin.hidden = true;
    appPrincipal.hidden = false;

    // Atualiza informações do usuário no header
    badgePapel.textContent = sessao.papel === "barbeiro" ? "Barbeiro" : "Cliente";
    nomeUsuarioLogado.textContent = sessao.nome;

    if (sessao.papel === "barbeiro") {
      painelBarbeiro.hidden = false;
      painelBarbeiro.classList.add("ativo");
      painelCliente.hidden = true;
      painelCliente.classList.remove("ativo");
      UIBarbeiro.renderizar();
    } else {
      painelCliente.hidden = false;
      painelCliente.classList.add("ativo");
      painelBarbeiro.hidden = true;
      painelBarbeiro.classList.remove("ativo");
      UICliente.inicializar();
      Calendario.renderizar();
    }
  }

  // ——— Login ———

  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    // Limpa erros anteriores
    erroLoginUsuario.textContent = "";
    erroLoginSenha.textContent = "";
    inputUsuario.classList.remove("campo-erro");
    inputSenha.classList.remove("campo-erro");
    feedbackLogin.className = "feedback";
    feedbackLogin.textContent = "";

    var usuario = inputUsuario.value.trim();
    var senha   = inputSenha.value;

    // Validação básica dos campos
    var valido = true;
    if (!usuario) {
      erroLoginUsuario.textContent = "Informe o usuário.";
      inputUsuario.classList.add("campo-erro");
      valido = false;
    }
    if (!senha) {
      erroLoginSenha.textContent = "Informe a senha.";
      inputSenha.classList.add("campo-erro");
      valido = false;
    }
    if (!valido) return;

    var resultado = Auth.login(usuario, senha);
    if (!resultado.ok) {
      feedbackLogin.textContent = resultado.erro;
      feedbackLogin.className = "feedback erro";
      inputUsuario.classList.add("campo-erro");
      inputSenha.classList.add("campo-erro");
      inputSenha.value = "";
      inputUsuario.focus();
      return;
    }

    mostrarApp(resultado.usuario);
  });

  // ——— Logout ———

  btnLogout.addEventListener("click", function () {
    Auth.logout();
    inputUsuario.value = "";
    inputSenha.value = "";
    mostrarTelaLogin();
    inputUsuario.focus();
  });

  // ——— Política de privacidade (rodapé) ———

  if (linkPolitica && textoPolitica) {
    linkPolitica.addEventListener("click", function (e) {
      e.preventDefault();
      textoPolitica.hidden = !textoPolitica.hidden;
      linkPolitica.textContent = textoPolitica.hidden
        ? "Política de privacidade"
        : "Ocultar política";
    });
  }

  // ——— Inicialização ———

  // Inicializa o banco de dados IndexedDB
  DB.inicializar().then(function () {
    // Inicializa os serviços padrão na primeira carga
    return Storage.inicializarServicospadrao();
  }).then(function () {
    // Verifica se há sessão ativa (ex.: após recarregar a página)
    var sessaoAtiva = Auth.getSessao();
    if (sessaoAtiva) {
      mostrarApp(sessaoAtiva);
    } else {
      mostrarTelaLogin();
      // Foca no campo de usuário automaticamente
      setTimeout(function () { inputUsuario.focus(); }, 100);
    }
  }).catch(function (erro) {
    console.error("Erro na inicialização:", erro);
    alert("Erro ao inicializar o banco de dados. Verifique o console para mais detalhes.");
  });

})();
