/**
 * calendario.js — Lógica e renderização do calendário do cliente
 *
 * Bugs corrigidos do código original:
 * 1. A navegação estava invertida: o botão "mês anterior" incrementava o mês
 *    e o botão "próximo mês" decrementava. Corrigido para comportamento correto.
 * 2. O loop de dias parava em `dia < ultimoDia` (excluía o último dia do mês).
 *    Corrigido para `dia <= ultimoDia`.
 */

var Calendario = (function () {
  "use strict";

  var calTitulo  = document.getElementById("cal-titulo-mes");
  var calGrade   = document.getElementById("cal-grade");
  var btnAnt     = document.getElementById("cal-mes-ant");
  var btnProx    = document.getElementById("cal-prox-mes");
  var inputData  = document.getElementById("ag-data");

  var hoje   = new Date();
  var mesCal = hoje.getMonth();
  var anoCal = hoje.getFullYear();

  /** Retorna um Set com os dias do mês/ano que possuem agendamentos. */
  function diasComAgendamento(ano, mes) {
    return Storage.getAgendamentos().then(function (agendamentos) {
      var dias = {};
      agendamentos.forEach(function (a) {
        // a.data está no formato "YYYY-MM-DD"
        var partes = a.data.split("-");
        var aAno = parseInt(partes[0], 10);
        var aMes = parseInt(partes[1], 10) - 1; // mês base-0
        var aDia = parseInt(partes[2], 10);
        if (aAno === ano && aMes === mes) {
          dias[aDia] = true;
        }
      });
      return dias;
    });
  }

  /** Cria uma célula vazia (para preencher o início do mês). */
  function celulaVazia() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-dia fora";
    btn.disabled = true;
    btn.setAttribute("aria-hidden", "true");
    btn.tabIndex = -1;
    return btn;
  }

  /** Cria a célula de um dia clicável. */
  function celulaDia(dia, ehHoje, temEvento, ano, mes) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-dia";
    btn.textContent = String(dia);

    var dataObj = new Date(ano, mes, dia);
    var diaSemana = dataObj.getDay();
    var ehDomingo = diaSemana === 0;

    // Destaque para o dia de hoje
    if (ehHoje) btn.classList.add("hoje");

    // Ponto indicando agendamento existente
    if (temEvento) btn.classList.add("tem-evento");

    // Destaque para o dia atualmente selecionado no input
    var valorAtual = inputData ? inputData.value : "";
    var mm = String(mes + 1).padStart(2, "0");
    var dd = String(dia).padStart(2, "0");
    var isoStr = ano + "-" + mm + "-" + dd;
    if (valorAtual === isoStr) btn.classList.add("selecionado");

    // Desabilita domingos (dias de fechamento)
    if (ehDomingo) {
      btn.classList.add("fechado");
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("aria-label", dia + " de " + dataObj.toLocaleDateString("pt-BR", { month: "long" }) + " - Fechado (domingo)");
    } else {
      btn.setAttribute("aria-label", dia + " de " + dataObj.toLocaleDateString("pt-BR", { month: "long" }));

      // Ao clicar, preenche o campo de data do formulário
      btn.addEventListener("click", function () {
        if (inputData) {
          inputData.value = isoStr;
          // Atualiza destaque visual de seleção
          renderizar();
        }
      });
    }

    return btn;
  }

  /** Renderiza o calendário para o mês/ano atual. */
  function renderizar() {
    var primeiroDia   = new Date(anoCal, mesCal, 1);
    var ultimoDia     = new Date(anoCal, mesCal + 1, 0).getDate();
    var diaSemanaInicio = primeiroDia.getDay(); // 0 = Domingo

    calTitulo.textContent = primeiroDia.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    calGrade.innerHTML = "";

    diasComAgendamento(anoCal, mesCal).then(function (marcacoes) {
      // Células vazias antes do primeiro dia
      for (var i = 0; i < diaSemanaInicio; i++) {
        calGrade.appendChild(celulaVazia());
      }

      // Bug corrigido: era `dia < ultimoDia` (excluía o último dia); agora `dia <= ultimoDia`
      for (var dia = 1; dia <= ultimoDia; dia++) {
        var ehHoje =
          dia === hoje.getDate() &&
          mesCal === hoje.getMonth() &&
          anoCal === hoje.getFullYear();
        calGrade.appendChild(celulaDia(dia, ehHoje, !!marcacoes[dia], anoCal, mesCal));
      }
    }).catch(function (erro) {
      console.error("Erro ao carregar agendamentos para calendário:", erro);
    });
  }

  // Bug corrigido: os listeners estavam invertidos no código original
  // (cal-mes-ant incrementava o mês; cal-prox-mes decrementava)
  btnAnt.addEventListener("click", function () {
    mesCal--;
    if (mesCal < 0) {
      mesCal = 11;
      anoCal--;
    }
    renderizar();
  });

  btnProx.addEventListener("click", function () {
    mesCal++;
    if (mesCal > 11) {
      mesCal = 0;
      anoCal++;
    }
    renderizar();
  });

  return { renderizar: renderizar };
})();
