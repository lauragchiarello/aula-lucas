/**
 * ui-barbeiro.js — Interface da área do barbeiro
 *
 * Responsabilidades:
 * - Renderizar a lista de serviços cadastrados
 * - Gerenciar o formulário de cadastro de serviços (com validação)
 * - Renderizar a tabela de agendamentos (com opção de cancelar)
 */

var UIBarbeiro = (function () {
  "use strict";

  // ——— Elementos do DOM ———
  var formServico    = document.getElementById("form-servico");
  var inputSvNome    = document.getElementById("sv-nome");
  var erroSvNome     = document.getElementById("erro-sv-nome");
  var feedbackSv     = document.getElementById("feedback-sv");
  var listaServicos  = document.getElementById("lista-servicos");
  var tbodyAg        = document.getElementById("tbody-agendamentos");

  // ——— Utilitários ———

  /** Escapa HTML para evitar XSS ao inserir dados do usuário no DOM. */
  function escaparHtml(texto) {
    if (!texto) return "";
    var div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  /** Formata data e hora no padrão brasileiro. */
  function formatarDataHora(data, hora) {
    if (!data || !hora) return "—";
    var partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0] + " às " + hora;
  }

  /** Exibe uma mensagem de feedback temporária. */
  function mostrarFeedback(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.className = "feedback " + tipo;
    setTimeout(function () {
      elemento.className = "feedback";
      elemento.textContent = "";
    }, 3500);
  }

  // ——— Serviços ———

  /** Renderiza a lista de serviços e atualiza o select do cliente. */
  function renderizarServicos() {
    var servicos = Storage.getServicos();
    listaServicos.innerHTML = "";

    if (servicos.length === 0) {
      var li = document.createElement("li");
      li.className = "lista-servicos-vazia";
      li.textContent = "Nenhum serviço cadastrado ainda.";
      listaServicos.appendChild(li);
    } else {
      servicos.forEach(function (s) {
        var li = document.createElement("li");

        var span = document.createElement("span");
        span.textContent = s.nome;
        li.appendChild(span);

        var btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "btn-icone";
        btnExcluir.textContent = "Excluir";
        btnExcluir.setAttribute("aria-label", "Excluir serviço " + s.nome);
        btnExcluir.setAttribute("data-id", s.id);
        btnExcluir.addEventListener("click", function () {
          Storage.removerServico(s.id);
          renderizarServicos();
          UICliente.atualizarSelectServicos();
        });

        li.appendChild(btnExcluir);
        listaServicos.appendChild(li);
      });
    }

    // Atualiza o select do cliente sempre que a lista mudar
    if (typeof UICliente !== "undefined") {
      UICliente.atualizarSelectServicos();
    }
  }

  // Validação e envio do formulário de serviço
  formServico.addEventListener("submit", function (e) {
    e.preventDefault();

    var nome = inputSvNome.value.trim();
    var valido = true;

    // Limpa erros anteriores
    erroSvNome.textContent = "";
    inputSvNome.classList.remove("campo-erro");

    if (!nome) {
      erroSvNome.textContent = "Informe o nome do serviço.";
      inputSvNome.classList.add("campo-erro");
      inputSvNome.focus();
      valido = false;
    } else if (nome.length < 3) {
      erroSvNome.textContent = "O nome deve ter pelo menos 3 caracteres.";
      inputSvNome.classList.add("campo-erro");
      inputSvNome.focus();
      valido = false;
    } else {
      // Verifica duplicata
      var jaExiste = Storage.getServicos().some(function (s) {
        return s.nome.toLowerCase() === nome.toLowerCase();
      });
      if (jaExiste) {
        erroSvNome.textContent = "Já existe um serviço com este nome.";
        inputSvNome.classList.add("campo-erro");
        inputSvNome.focus();
        valido = false;
      }
    }

    if (!valido) return;

    Storage.adicionarServico(nome);
    inputSvNome.value = "";
    renderizarServicos();
    mostrarFeedback(feedbackSv, "Serviço \"" + nome + "\" adicionado com sucesso!", "sucesso");
  });

  // ——— Agendamentos ———

  /** Renderiza a tabela de agendamentos ordenados por data/hora. */
  function renderizarAgendamentos() {
    var agendamentos = Storage.getAgendamentos().slice().sort(function (a, b) {
      var da = a.data + "T" + a.hora;
      var db = b.data + "T" + b.hora;
      return da < db ? -1 : da > db ? 1 : 0;
    });

    tbodyAg.innerHTML = "";

    if (agendamentos.length === 0) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = 5;
      td.className = "tabela-vazia";
      td.textContent = "Nenhum agendamento registrado.";
      tr.appendChild(td);
      tbodyAg.appendChild(tr);
      return;
    }

    agendamentos.forEach(function (ag) {
      var tr = document.createElement("tr");

      function celula(texto) {
        var td = document.createElement("td");
        td.textContent = texto;
        return td;
      }

      tr.appendChild(celula(formatarDataHora(ag.data, ag.hora)));
      tr.appendChild(celula(ag.nomeCliente));
      tr.appendChild(celula(ag.whatsapp));
      tr.appendChild(celula(ag.servicoNome));

      var tdAcao = document.createElement("td");
      var btnCancelar = document.createElement("button");
      btnCancelar.type = "button";
      btnCancelar.className = "btn-icone";
      btnCancelar.textContent = "Cancelar";
      btnCancelar.setAttribute("aria-label", "Cancelar agendamento de " + ag.nomeCliente);
      btnCancelar.addEventListener("click", function () {
        Storage.cancelarAgendamento(ag.id);
        renderizarAgendamentos();
        if (typeof Calendario !== "undefined") Calendario.renderizar();
      });
      tdAcao.appendChild(btnCancelar);
      tr.appendChild(tdAcao);

      tbodyAg.appendChild(tr);
    });
  }

  /** Renderiza toda a área do barbeiro. */
  function renderizar() {
    renderizarServicos();
    renderizarAgendamentos();
  }

  return {
    renderizar:            renderizar,
    renderizarServicos:    renderizarServicos,
    renderizarAgendamentos: renderizarAgendamentos,
  };
})();
