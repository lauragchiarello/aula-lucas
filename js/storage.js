/**
 * storage.js — Camada de acesso ao localStorage
 *
 * Centraliza todas as operações de leitura e escrita de dados,
 * separando a responsabilidade de persistência da lógica de UI.
 */

var Storage = (function () {
  "use strict";

  var KEY_SERVICOS      = "barbearia_servicos";
  var KEY_AGENDAMENTOS  = "barbearia_agendamentos";

  // ——— Utilitários internos ———

  function carregar(chave, padrao) {
    try {
      var raw = localStorage.getItem(chave);
      if (!raw) return padrao;
      return JSON.parse(raw);
    } catch (e) {
      return padrao;
    }
  }

  function salvar(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }

  /** Gera um identificador único simples. */
  function uid() {
    return String(Date.now()) + "-" + Math.random().toString(36).slice(2, 9);
  }

  // ——— Serviços ———

  /**
   * Serviços padrão da barbearia (inicializados na primeira carga).
   */
  var SERVICOS_PADRAO = [
    { nome: 'Corte masculino' },
    { nome: 'Barba' },
    { nome: 'Corte + Barba' },
    { nome: 'Hidratação' },
    { nome: 'Progressiva' }
  ];

  /**
   * Inicializa os serviços padrão se o localStorage estiver vazio.
   */
  function inicializarServicospadrao() {
    var servicos = carregar(KEY_SERVICOS, null);
    if (servicos === null || (Array.isArray(servicos) && servicos.length === 0)) {
      var novoServicos = SERVICOS_PADRAO.map(function (s) {
        return { id: uid(), nome: s.nome };
      });
      salvar(KEY_SERVICOS, novoServicos);
    }
  }

  function getServicos() {
    var s = carregar(KEY_SERVICOS, []);
    return Array.isArray(s) ? s : [];
  }

  function adicionarServico(nome) {
    var servicos = getServicos();
    var novo = { id: uid(), nome: nome.trim() };
    servicos.push(novo);
    salvar(KEY_SERVICOS, servicos);
    return novo;
  }

  function removerServico(id) {
    var restantes = getServicos().filter(function (s) { return s.id !== id; });
    salvar(KEY_SERVICOS, restantes);
  }

  // ——— Agendamentos ———

  function getAgendamentos() {
    var a = carregar(KEY_AGENDAMENTOS, []);
    return Array.isArray(a) ? a : [];
  }

  /**
   * Adiciona um novo agendamento.
   * @param {{ nomeCliente, whatsapp, servicoId, servicoNome, data, hora }} dados
   * @returns {object} O agendamento criado.
   */
  function adicionarAgendamento(dados) {
    var lista = getAgendamentos();
    var novo = {
      id:          uid(),
      nomeCliente: dados.nomeCliente,
      whatsapp:    dados.whatsapp,
      servicoId:   dados.servicoId,
      servicoNome: dados.servicoNome,
      data:        dados.data,   // "YYYY-MM-DD"
      hora:        dados.hora,   // "HH:MM"
    };
    lista.push(novo);
    salvar(KEY_AGENDAMENTOS, lista);
    return novo;
  }

  function cancelarAgendamento(id) {
    var restantes = getAgendamentos().filter(function (a) { return a.id !== id; });
    salvar(KEY_AGENDAMENTOS, restantes);
  }

  /**
   * Verifica se já existe agendamento para a mesma data e hora.
   * @param {string} data  "YYYY-MM-DD"
   * @param {string} hora  "HH:MM"
   * @param {string} [ignorarId]  ID a ignorar na verificação (para edição futura)
   * @returns {boolean}
   */
  function horarioOcupado(data, hora, ignorarId) {
    return getAgendamentos().some(function (a) {
      return a.data === data && a.hora === hora && a.id !== ignorarId;
    });
  }

  return {
    inicializarServicospadrao: inicializarServicospadrao,
    getServicos:          getServicos,
    adicionarServico:     adicionarServico,
    removerServico:       removerServico,
    getAgendamentos:      getAgendamentos,
    adicionarAgendamento: adicionarAgendamento,
    cancelarAgendamento:  cancelarAgendamento,
    horarioOcupado:       horarioOcupado,
  };
})();
