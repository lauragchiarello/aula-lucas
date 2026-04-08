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

  // Atualiza limites de horário quando a data muda
  inputData.addEventListener("change", function () {
    atualizarLimitesHorario();
  });

  /** Atualiza os atributos min/max do input de hora baseado na data selecionada */
  function atualizarLimitesHorario() {
    var data = inputData.value;
    if (!data) {
      inputHora.min = "08:00";
      inputHora.max = "20:00";
      return;
    }

    var dataObj = new Date(data + "T00:00:00");
    var diaSemana = dataObj.getDay();

    if (diaSemana === 0) {
      // Domingo - sem atendimento
      inputHora.min = "";
      inputHora.max = "";
    } else if (diaSemana >= 1 && diaSemana <= 5) {
      // Segunda a sexta: 8h às 17h
      inputHora.min = "08:00";
      inputHora.max = "16:59";
    } else if (diaSemana === 6) {
      // Sábado: 8h às 13h
      inputHora.min = "08:00";
      inputHora.max = "12:59";
    }

    // Limpa o valor atual se estiver fora dos novos limites
    if (inputHora.value && !horarioValidoParaData(data, inputHora.value)) {
      inputHora.value = "";
    }
  }

  // ——— Utilitários ———

  function definirErro(input, spanErro, mensagem) {
    spanErro.textContent = mensagem;
    if (mensagem) {
      input.classList.add("campo-erro");
    } else {
      input.classList.remove("campo-erro");
    }
  }

  /** Verifica se um horário é válido para uma data específica considerando os dias de funcionamento */
  function horarioValidoParaData(data, hora) {
    var dataObj = new Date(data + "T" + hora);
    var diaSemana = dataObj.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    var partes = hora.split(":");
    var hh = parseInt(partes[0], 10);
    var mm = parseInt(partes[1], 10);

    // Domingo: sem atendimento
    if (diaSemana === 0) {
      return false;
    }

    // Segunda a sexta: 8h às 17h
    if (diaSemana >= 1 && diaSemana <= 5) {
      return hh >= 8 && hh < 17;
    }

    // Sábado: 8h às 13h
    if (diaSemana === 6) {
      return hh >= 8 && hh < 13;
    }

    return false;
  }

  /** Retorna a descrição do expediente para um dia da semana */
  function getExpedienteDia(diaSemana) {
    switch (diaSemana) {
      case 0: return "Domingo: fechado";
      case 1: case 2: case 3: case 4: case 5: return "Segunda a sexta: 8h às 17h";
      case 6: return "Sábado: 8h às 13h";
      default: return "";
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
    Storage.getServicos().then(function (servicos) {
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
    }).catch(function (erro) {
      console.error("Erro ao carregar serviços:", erro);
    });
  }

  // ——— Validação do formulário ———

  /**
   * Valida todos os campos do formulário de agendamento.
   * @returns {Promise<boolean>} Promise que resolve para true se todos os campos são válidos.
   */
  function validarFormulario() {
    return new Promise(function (resolve) {
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
        } else {
          // Verifica se é domingo (dia de fechamento)
          var diaSemana = dataSelecionada.getDay();
          if (diaSemana === 0) {
            definirErro(inputData, erroData, "A barbearia não atende aos domingos.");
            valido = false;
          }
        }
      }

      // Hora
      var hora = inputHora.value;
      if (!hora) {
        definirErro(inputHora, erroHora, "Selecione um horário.");
        valido = false;
      } else if (data) {
        // Valida horário considerando o dia da semana
        if (!horarioValidoParaData(data, hora)) {
          var dataObj = new Date(data + "T00:00:00");
          var expediente = getExpedienteDia(dataObj.getDay());
          definirErro(inputHora, erroHora, "Horário inválido. " + expediente);
          valido = false;
        }
      }

      // Se já inválido, não precisa verificar horário ocupado
      if (!valido) {
        resolve(false);
        return;
      }

      // Verifica conflito de horário (regra de negócio)
      Storage.horarioOcupado(data, hora).then(function (ocupado) {
        if (ocupado) {
          mostrarFeedback("Este horário já está ocupado. Escolha outro.", "erro");
          valido = false;
        }

        // Foca no primeiro campo com erro
        if (!valido) {
          var campoErro = formAg.querySelector(".campo-erro");
          if (campoErro) campoErro.focus();
        }

        resolve(valido);
      }).catch(function (erro) {
        console.error("Erro ao verificar horário:", erro);
        mostrarFeedback("Erro ao verificar disponibilidade.", "erro");
        resolve(false);
      });
    });
  }

  // ——— Envio do formulário ———

  formAg.addEventListener("submit", function (e) {
    e.preventDefault();

    validarFormulario().then(function (valido) {
      if (!valido) return;

      var servicoId  = selectServico.value;
      var servicoNome = selectServico.options[selectServico.selectedIndex].textContent;

      Storage.adicionarAgendamento({
        nomeCliente: inputNome.value.trim(),
        whatsapp:    inputWhatsapp.value.trim(),
        servicoId:   servicoId,
        servicoNome: servicoNome,
        data:        inputData.value,
        hora:        inputHora.value,
      }).then(function (agendamento) {
        mostrarFeedback("Agendamento confirmado com sucesso!", "sucesso");

        // Limpa campos após confirmação
        inputNome.value     = "";
        inputWhatsapp.value = "";
        selectServico.value = "";
        inputHora.value     = "09:00";

        // Atualiza o calendário para refletir o novo agendamento
        if (typeof Calendario !== "undefined") Calendario.renderizar();
      }).catch(function (erro) {
        console.error("Erro ao adicionar agendamento:", erro);
        mostrarFeedback("Erro ao confirmar agendamento.", "erro");
      });
    });
  });

  // ——— Inicialização ———

  /** Define a data padrão como hoje. */
  function inicializar() {
    var hoje = new Date();
    var ano  = hoje.getFullYear();
    var mes  = String(hoje.getMonth() + 1).padStart(2, "0");
    var dia  = String(hoje.getDate()).padStart(2, "0");
    inputData.value = ano + "-" + mes + "-" + dia;
    atualizarLimitesHorario();
    inputHora.value = "09:00";
    atualizarSelectServicos();
  }

  return {
    inicializar:           inicializar,
    atualizarSelectServicos: atualizarSelectServicos,
  };
})();
