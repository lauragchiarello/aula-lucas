/**
 * storage.js — Camada de acesso aos dados (agora usando IndexedDB)
 *
 * Centraliza todas as operações de leitura e escrita de dados,
 * separando a responsabilidade de persistência da lógica de UI.
 * Agora usa IndexedDB para melhor performance e capacidades.
 */

var Storage = (function () {
  "use strict";

  // ——— Utilitários ———

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
   * Inicializa os serviços padrão se o banco estiver vazio.
   */
  function inicializarServicospadrao() {
    return DB.getServicos().then(function (servicos) {
      if (servicos.length === 0) {
        var promises = SERVICOS_PADRAO.map(function (s) {
          return DB.adicionarServico(s.nome);
        });
        return Promise.all(promises);
      }
    });
  }

  function getServicos() {
    return DB.getServicos();
  }

  function adicionarServico(nome) {
    return DB.adicionarServico(nome);
  }

  function removerServico(id) {
    return DB.removerServico(id);
  }

  // ——— Agendamentos ———

  function getAgendamentos() {
    return DB.getAgendamentos();
  }

  /**
   * Adiciona um novo agendamento.
   * @param {{ nomeCliente, whatsapp, servicoId, servicoNome, data, hora }} dados
   * @returns {Promise<object>} O agendamento criado.
   */
  function adicionarAgendamento(dados) {
    return DB.adicionarAgendamento(dados);
  }

  function cancelarAgendamento(id) {
    return DB.cancelarAgendamento(id);
  }

  /**
   * Verifica se já existe agendamento para a mesma data e hora.
   * @param {string} data  "YYYY-MM-DD"
   * @param {string} hora  "HH:MM"
   * @param {string} [ignorarId]  ID a ignorar na verificação (para edição futura)
   * @returns {Promise<boolean>}
   */
  function horarioOcupado(data, hora, ignorarId) {
    return DB.horarioOcupado(data, hora, ignorarId);
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
