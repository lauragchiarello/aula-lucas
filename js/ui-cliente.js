/**
 * ui-cliente.js — Interface da área do cliente
 *
 * Responsabilidades:
 * - Preencher o select de serviços disponíveis
 * - Gerenciar o formulário de agendamento com validação completa
 * - Aplicar máscara de WhatsApp
 */

var UICliente = (function () {
  "use strict";

  // ——— Elementos do DOM ———
  var formAg         = document.getElementById("form-agendamento");
  var inputNome      = document.getElementById("ag-nome");
  var inputWhatsapp  = document.getElementById("ag-whatsapp");
  var selectServico  = document.getElementById("ag-servico");
  var inputData      = document.getElementById("ag-data");
  var inputHora      = document.getElementById("ag-hora");
  var feedbackAg     = document.getElementById("feedback-ag");

  var erroNome      = document.getElementById("erro-ag-nome");
  var erroWhatsapp  = document.getElementById("erro-ag-whatsapp");
  var erroServico   = document.getElementById("erro-ag-servico");
  var erroData      = document.getElementById("erro-ag-data");
  var erroHora      = document.getElementById("erro-ag-hora");

  // ——— Máscara de WhatsApp ———

  inputWhatsapp.addEventListener("input", function () {
    var v = inputWhatsapp.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
      v = "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
    } else if (v.length > 2) {
      v = "(" + v.slice(0, 2) + ") " + v.slice(2);
    } else if (v.length > 0) {
      v = "(" + v;
    }
    inputWhatsapp.value = v;
  });

  // ——— Utilitários ———

  function definirErro(input, spanErro, mensagem) {
    spanErro.textContent = mensagem;
    if (mensagem) {
      input.classList.add("campo-erro");
    } else {
      input.classList.remove("campo-erro");
    }
  }

  function limparErros() {
    definirErro(inputNome,     erroNome,     "");
    definirErro(inputWhatsapp, erroWhatsapp, "");
    definirErro(selectServico, erroServico,  "");
    definirErro(inputData,     erroData,     "");
    definirErro(inputHora,     erroHora,     "");
    feedbackAg.className = "feedback";
    feedbackAg.textContent = "";
  }

  function mostrarFeedback(mensagem, tipo) {
    feedbackAg.textContent = mensagem;
    feedbackAg.className = "feedback " + tipo;
    if (tipo === "sucesso") {
      setTimeout(function () {
        feedbackAg.className = "feedback";
        feedbackAg.textContent = "";
      }, 4000);
    }
  }

  // ——— Select de serviços ———

  /** Atualiza o select com os serviços cadastrados pelo barbeiro. */
  function atualizarSelectServicos() {
    var servicos = Storage.getServicos();
    var valorAtual = selectServico.value;

    selectServico.innerHTML = "";

    var opcaoPadrao = document.createElement("option");
    opcaoPadrao.value = "";
    opcaoPadrao.textContent = "— Selecione um serviço —";
    selectServico.appendChild(opcaoPadrao);

    servicos.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.nome;
      selectServico.appendChild(opt);
    });

    // Mantém seleção anterior se ainda existir
    if (valorAtual && servicos.some(function (s) { return s.id === valorAtual; })) {
      selectServico.value = valorAtual;
    }
  }

  // ——— Validação do formulário ———

  /**
   * Valida todos os campos do formulário de agendamento.
   * @returns {boolean} true se todos os campos são válidos.
   */
  function validarFormulario() {
    var valido = true;
    limparErros();

    // Nome
    var nome = inputNome.value.trim();
    if (!nome) {
      definirErro(inputNome, erroNome, "Informe seu nome completo.");
      valido = false;
    } else if (nome.length < 3) {
      definirErro(inputNome, erroNome, "O nome deve ter pelo menos 3 caracteres.");
      valido = false;
    }

    // WhatsApp — valida apenas os dígitos (mínimo 10, máximo 11)
    var digitos = inputWhatsapp.value.replace(/\D/g, "");
    if (!digitos) {
      definirErro(inputWhatsapp, erroWhatsapp, "Informe seu WhatsApp.");
      valido = false;
    } else if (digitos.length < 10 || digitos.length > 11) {
      definirErro(inputWhatsapp, erroWhatsapp, "WhatsApp inválido. Use o formato (DD) 99999-9999.");
      valido = false;
    }

    // Serviço
    if (!selectServico.value) {
      definirErro(selectServico, erroServico, "Selecione um serviço.");
      valido = false;
    }

    // Data
    var data = inputData.value;
    if (!data) {
      definirErro(inputData, erroData, "Selecione uma data.");
      valido = false;
    } else {
      // Não permite data no passado
      var hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      var dataSelecionada = new Date(data + "T00:00:00");
      if (dataSelecionada < hoje) {
        definirErro(inputData, erroData, "Não é possível agendar em uma data passada.");
        valido = false;
      }
    }

    // Hora
    var hora = inputHora.value;
    if (!hora) {
      definirErro(inputHora, erroHora, "Selecione um horário.");
      valido = false;
    } else {
      // Valida horário de funcionamento (08:00 às 20:00)
      var partes = hora.split(":");
      var hh = parseInt(partes[0], 10);
      if (hh < 8 || hh >= 20) {
        definirErro(inputHora, erroHora, "Horário fora do expediente (08:00 às 20:00).");
        valido = false;
      }
    }

    // Verifica conflito de horário (regra de negócio)
    if (valido && Storage.horarioOcupado(data, hora)) {
      mostrarFeedback("Este horário já está ocupado. Escolha outro.", "erro");
      valido = false;
    }

    // Foca no primeiro campo com erro
    if (!valido) {
      var campoErro = formAg.querySelector(".campo-erro");
      if (campoErro) campoErro.focus();
    }

    return valido;
  }

  // ——— Envio do formulário ———

  formAg.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    var servicoId  = selectServico.value;
    var servicoNome = selectServico.options[selectServico.selectedIndex].textContent;

    Storage.adicionarAgendamento({
      nomeCliente: inputNome.value.trim(),
      whatsapp:    inputWhatsapp.value.trim(),
      servicoId:   servicoId,
      servicoNome: servicoNome,
      data:        inputData.value,
      hora:        inputHora.value,
    });

    // Limpa campos após confirmação
    inputNome.value     = "";
    inputWhatsapp.value = "";
    selectServico.value = "";
    inputHora.value     = "09:00";

    mostrarFeedback("Agendamento confirmado com sucesso!", "sucesso");

    // Atualiza o calendário para refletir o novo agendamento
    if (typeof Calendario !== "undefined") Calendario.renderizar();
  });

  // ——— Inicialização ———

  /** Define a data padrão como hoje. */
  function inicializar() {
    var hoje = new Date();
    var ano  = hoje.getFullYear();
    var mes  = String(hoje.getMonth() + 1).padStart(2, "0");
    var dia  = String(hoje.getDate()).padStart(2, "0");
    inputData.value = ano + "-" + mes + "-" + dia;
    inputHora.value = "09:00";
    atualizarSelectServicos();
  }

  return {
    inicializar:           inicializar,
    atualizarSelectServicos: atualizarSelectServicos,
  };
})();
