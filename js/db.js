/**
 * db.js — Camada de acesso ao IndexedDB
 *
 * Banco de dados local mais robusto para armazenar serviços e agendamentos.
 * Substitui o localStorage por IndexedDB para melhor performance e capacidades.
 */

var DB = (function () {
  "use strict";

  var dbName = "BarbeariaDB";
  var dbVersion = 1;
  var db = null;

  // ——— Inicialização do banco ———

  function init() {
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(dbName, dbVersion);

      request.onerror = function () {
        console.error("Erro ao abrir IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = function () {
        db = request.result;
        console.log("IndexedDB aberto com sucesso");
        resolve(db);
      };

      request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Cria object store para serviços
        if (!db.objectStoreNames.contains("servicos")) {
          var servicosStore = db.createObjectStore("servicos", { keyPath: "id" });
          servicosStore.createIndex("nome", "nome", { unique: false });
        }

        // Cria object store para agendamentos
        if (!db.objectStoreNames.contains("agendamentos")) {
          var agendamentosStore = db.createObjectStore("agendamentos", { keyPath: "id" });
          agendamentosStore.createIndex("data", "data", { unique: false });
          agendamentosStore.createIndex("dataHora", ["data", "hora"], { unique: false });
        }

        console.log("IndexedDB criado/atualizado");
      };
    });
  }

  // ——— Utilitários ———

  function gerarId() {
    return String(Date.now()) + "-" + Math.random().toString(36).slice(2, 9);
  }

  // ——— Serviços ———

  function getServicos() {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var transaction = db.transaction(["servicos"], "readonly");
      var store = transaction.objectStore("servicos");
      var request = store.getAll();

      request.onsuccess = function () {
        resolve(request.result || []);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  function adicionarServico(nome) {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var servico = {
        id: gerarId(),
        nome: nome.trim()
      };

      var transaction = db.transaction(["servicos"], "readwrite");
      var store = transaction.objectStore("servicos");
      var request = store.add(servico);

      request.onsuccess = function () {
        resolve(servico);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  function removerServico(id) {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var transaction = db.transaction(["servicos"], "readwrite");
      var store = transaction.objectStore("servicos");
      var request = store.delete(id);

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  // ——— Agendamentos ———

  function getAgendamentos() {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var transaction = db.transaction(["agendamentos"], "readonly");
      var store = transaction.objectStore("agendamentos");
      var request = store.getAll();

      request.onsuccess = function () {
        resolve(request.result || []);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  function adicionarAgendamento(dados) {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var agendamento = {
        id: gerarId(),
        nomeCliente: dados.nomeCliente,
        whatsapp: dados.whatsapp,
        servicoId: dados.servicoId,
        servicoNome: dados.servicoNome,
        data: dados.data, // "YYYY-MM-DD"
        hora: dados.hora  // "HH:MM"
      };

      var transaction = db.transaction(["agendamentos"], "readwrite");
      var store = transaction.objectStore("agendamentos");
      var request = store.add(agendamento);

      request.onsuccess = function () {
        resolve(agendamento);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  function cancelarAgendamento(id) {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var transaction = db.transaction(["agendamentos"], "readwrite");
      var store = transaction.objectStore("agendamentos");
      var request = store.delete(id);

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  function horarioOcupado(data, hora, ignorarId) {
    return new Promise(function (resolve, reject) {
      if (!db) {
        reject(new Error("Banco não inicializado"));
        return;
      }

      var transaction = db.transaction(["agendamentos"], "readonly");
      var store = transaction.objectStore("agendamentos");
      var index = store.index("dataHora");
      var range = IDBKeyRange.only([data, hora]);
      var request = index.openCursor(range);

      var ocupado = false;

      request.onsuccess = function () {
        var cursor = request.result;
        if (cursor) {
          if (cursor.value.id !== ignorarId) {
            ocupado = true;
          }
          cursor.continue();
        } else {
          resolve(ocupado);
        }
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  // ——— Migração de dados do localStorage (se existir) ———

  function migrarDadosLocalStorage() {
    return new Promise(function (resolve, reject) {
      // Verifica se há dados no localStorage
      var servicosLS = localStorage.getItem("barbearia_servicos");
      var agendamentosLS = localStorage.getItem("barbearia_agendamentos");

      if (!servicosLS && !agendamentosLS) {
        resolve(); // Nada para migrar
        return;
      }

      var promises = [];

      // Migra serviços
      if (servicosLS) {
        try {
          var servicos = JSON.parse(servicosLS);
          servicos.forEach(function (s) {
            if (!s.id) s.id = gerarId();
            promises.push(adicionarServico(s.nome).catch(function () {
              // Ignora erros de duplicata
            }));
          });
        } catch (e) {
          console.warn("Erro ao migrar serviços do localStorage:", e);
        }
      }

      // Migra agendamentos
      if (agendamentosLS) {
        try {
          var agendamentos = JSON.parse(agendamentosLS);
          agendamentos.forEach(function (a) {
            if (!a.id) a.id = gerarId();
            promises.push(adicionarAgendamento(a).catch(function () {
              // Ignora erros de duplicata
            }));
          });
        } catch (e) {
          console.warn("Erro ao migrar agendamentos do localStorage:", e);
        }
      }

      Promise.all(promises).then(function () {
        // Limpa localStorage após migração
        localStorage.removeItem("barbearia_servicos");
        localStorage.removeItem("barbearia_agendamentos");
        console.log("Migração do localStorage para IndexedDB concluída");
        resolve();
      }).catch(reject);
    });
  }

  // ——— Inicialização completa ———

  function inicializar() {
    return init().then(migrarDadosLocalStorage);
  }

  return {
    inicializar: inicializar,
    getServicos: getServicos,
    adicionarServico: adicionarServico,
    removerServico: removerServico,
    getAgendamentos: getAgendamentos,
    adicionarAgendamento: adicionarAgendamento,
    cancelarAgendamento: cancelarAgendamento,
    horarioOcupado: horarioOcupado,
  };
})();