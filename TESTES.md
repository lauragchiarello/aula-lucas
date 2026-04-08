# TESTES.md — Checklist de Testes Manuais

Navalha Barbearia — Sistema de Agendamento  
Grupo: grupo1 | Data de execução: 31/03/2025

---

## Autenticação e Sessão

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T01 | Login com usuário `cliente` e senha `cliente123` | Redireciona para o painel do cliente; painel do barbeiro não é exibido | ✅ OK |
| T02 | Login com usuário `barbeiro` e senha `barbeiro123` | Redireciona para o painel do barbeiro; painel do cliente não é exibido | ✅ OK |
| T03 | Login com senha incorreta | Exibe mensagem de erro; campos ficam com borda vermelha | ✅ OK |
| T04 | Login com campos vazios | Exibe mensagens de erro individuais em cada campo | ✅ OK |
| T05 | Clicar em "Sair" após login | Retorna à tela de login; sessão é encerrada | ✅ OK |
| T06 | Recarregar a página após login | Mantém a sessão ativa (sessionStorage) e exibe o painel correto | ✅ OK |
| T07 | Acessar URL diretamente sem login | Exibe a tela de login (app principal está oculto) | ✅ OK |

---

## Cadastro de Serviços (Barbeiro)

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T08 | Cadastrar serviço com nome válido ("Corte masculino") | Serviço aparece na lista do barbeiro e no select do cliente | ✅ OK |
| T09 | Tentar cadastrar serviço com campo vazio | Exibe mensagem de erro; serviço não é salvo | ✅ OK |
| T10 | Tentar cadastrar serviço com nome duplicado | Exibe mensagem de erro informando duplicata | ✅ OK |
| T11 | Excluir um serviço cadastrado | Serviço é removido da lista e do select do cliente | ✅ OK |
| T12 | Recarregar a página após cadastrar serviços | Serviços persistem (localStorage) | ✅ OK |

---

## Agendamento (Cliente)

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T13 | Preencher todos os campos corretamente e confirmar | Agendamento salvo; mensagem de sucesso exibida; calendário atualizado | ✅ OK |
| T14 | Tentar agendar com nome vazio | Mensagem de erro no campo nome | ✅ OK |
| T15 | Tentar agendar com WhatsApp inválido (menos de 10 dígitos) | Mensagem de erro no campo WhatsApp | ✅ OK |
| T16 | Tentar agendar sem selecionar serviço | Mensagem de erro no campo serviço | ✅ OK |
| T17 | Tentar agendar com data no passado | Mensagem de erro informando data inválida | ✅ OK |
| T18 | Tentar agendar fora do horário de funcionamento (antes das 08:00 ou após 20:00) | Mensagem de erro de horário | ✅ OK |
| T19 | Tentar agendar no mesmo horário de um agendamento existente | Mensagem de erro informando conflito de horário | ✅ OK |
| T20 | Clicar em um dia no calendário | Campo de data é preenchido automaticamente; dia fica destacado | ✅ OK |
| T21 | Navegar para o mês seguinte no calendário | Calendário avança para o mês correto | ✅ OK |
| T22 | Navegar para o mês anterior no calendário | Calendário volta para o mês correto | ✅ OK |
| T23 | Dia com agendamento existente no calendário | Ponto dourado aparece abaixo do número do dia | ✅ OK |

---

## Gerenciamento de Agendamentos (Barbeiro)

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T24 | Agendamento criado pelo cliente aparece na tabela do barbeiro | Linha com data, cliente, WhatsApp e serviço exibida | ✅ OK |
| T25 | Agendamentos ordenados por data/hora na tabela | Agendamentos mais próximos aparecem primeiro | ✅ OK |
| T26 | Cancelar um agendamento na tabela | Linha removida da tabela; ponto no calendário removido | ✅ OK |
| T27 | Tabela sem agendamentos | Mensagem "Nenhum agendamento registrado." exibida | ✅ OK |

---

## Persistência de Dados

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T28 | Recarregar a página após criar agendamentos | Agendamentos persistem no localStorage | ✅ OK |
| T29 | Recarregar a página após cadastrar serviços | Serviços persistem no localStorage | ✅ OK |

---

## Responsividade

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T30 | Abrir em tela de 375px de largura (mobile) | Layout em coluna única; sem quebra de elementos | ✅ OK |
| T31 | Abrir em tela de 1024px (desktop) | Layout em duas colunas; calendário e formulário lado a lado | ✅ OK |

---

## Acessibilidade

| # | Caso de teste | Resultado esperado | Status |
|---|---------------|--------------------|--------|
| T32 | Navegar por todos os campos usando apenas Tab | Foco visível em todos os elementos interativos | ✅ OK |
| T33 | Verificar labels associados aos campos | Todos os inputs possuem `<label>` com `for` correspondente | ✅ OK |

---

## Observações sobre bugs encontrados durante os testes

1. **Bug T21/T22 (original):** A navegação do calendário estava invertida no código base. O botão "◀ Mês anterior" incrementava o mês e o botão "▶ Próximo mês" decrementava. Corrigido em `calendario.js`.
2. **Bug CSS (original):** O `<link>` no HTML apontava para `css/estilo.css` (sem o "s"), impedindo que qualquer estilo fosse carregado. Corrigido para `css/estilos.css`.
3. **Bug CSS (original):** Dois typos nas variáveis CSS (`--accentt` e `--accent-hober`) faziam com que o botão primário não tivesse cor correta no hover. Corrigidos.
4. **Bug calendário (original):** O loop de dias usava `dia < ultimoDia`, excluindo o último dia do mês. Corrigido para `dia <= ultimoDia`.
