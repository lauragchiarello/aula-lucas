# Atividade: agenda da barbearia (HTML, CSS e JavaScript)

Projeto base para **Ensino Técnico** em Desenvolvimento de Sistemas (ou equivalente). Os alunos partem de uma aplicação simples de agendamento (cliente e barbeiro) que grava dados no **localStorage** do navegador.

---

## Objetivos da aula

- Ler e **organizar** código front-end (HTML, CSS, JS).
- **Encontrar e corrigir** erros de comportamento, de marcação e de estilo.
- Refletir sobre **experiência de usuário (UX)** e **interface (UI)**.
- Implementar **autenticação simulada** (login) com **papéis** distintos (cliente × barbeiro).
- Aplicar **validação de formulários** com feedback claro.
- **Verificar** se as funcionalidades atendem aos requisitos (testes manuais / checklist).

---

## Cenário do sistema

Uma barbearia precisa de um protótipo web onde:

| Papel      | Funções esperadas (referência)                          |
|-----------|------------------------------------------------------------|
| **Cliente** | Ver calendário, criar agendamento (nome, WhatsApp, data/hora, serviço). |
| **Barbeiro** | Cadastrar serviços, visualizar e gerenciar agendamentos. |

Hoje o projeto usa **abas** para trocar de “modo”. Parte da evolução pedida é **substituir ou complementar** isso com **login** e **acesso condicional** às telas.

---

## Tarefas obrigatórias

### 1. Refatorar o código

- Separar responsabilidades: HTML (estrutura), CSS (apresentação), JS (comportamento). Evitar repetir lógica sem necessidade.
- Nomear variáveis e funções de forma **consistente** e legível (português ou inglês, mas **um padrão só** por equipe).
- Comentar **apenas** onde ajudar (trechos não óbvios, decisões técnicas curtas). Evitar poluir o arquivo.
- Opcional avançado: dividir o JS em módulos ou arquivos (`storage.js`, `ui-calendario.js`, etc.) se o professor autorizar e a turma souber usar `import`/`export` ou builds simples.

**Entrega:** código reorganizado, com estrutura de pastas explicada em um parágrafo no README ou no relatório.

---

### 2. Corrigir bugs

O código base **não está perfeito**: há falhas que impedem ou prejudicam o uso (CSS que não carrega, comportamento errado no calendário, detalhes de formatação, etc.).

- Use o **DevTools** do navegador (aba *Console*, *Network*, *Elements*).
- Documente cada correção: **o que estava errado**, **como encontrou**, **o que mudou** (lista no relatório).

**Entrega:** relatório de bugs (formato livre: tabela ou lista) + código corrigido.

---

### 3. Pensar em UX e UI

- **UX:** fluxo lógico (ex.: cliente não precisa ver controles do barbeiro; confirmação após agendar; mensagens compreensíveis).
- **UI:** hierarquia visual, contraste, espaçamento, estados de botão (hover, foco, desabilitado), consistência de cores e tipografia.
- **Responsividade:** uso razoável em **celular** (layout que não quebra, rolagem da tabela se necessário).
- **Acessibilidade (mínimo):** labels ligados aos campos, contraste legível, uso adequado de `aria-*` onde fizer sentido (abas, regiões principais).

**Entrega:** breve texto (meia página) ou slides com **3 melhorias** que vocês priorizaram e **por quê**.

---

### 4. Tela de login e papéis (cliente / barbeiro)

Implementar uma **tela inicial de login** (pode ser usuário + senha fixos em código ou salvos no `localStorage` só para estudo).

Requisitos mínimos:

- Após login como **cliente**, só a área do cliente fica acessível (ou é a primeira coisa que aparece).
- Após login como **barbeiro**, só a área do barbeiro fica acessível.
- **Logout** que limpa a sessão simulada e volta à tela de login.
- Deixar explícito no relatório: em produção real, autenticação seria no **servidor**; guardar senha em texto no navegador é **inseguro** e serve apenas para **aprendizado**.

**Entrega:** fluxo login → painel → logout funcionando.

---

### 5. Validação de campos

Incluir validação **no front-end** (HTML5 e/ou JavaScript), por exemplo:

- Nome não vazio (e limite razoável de tamanho).
- WhatsApp com formato mínimo aceitável (ex.: só dígitos, quantidade mínima) ou máscara simples.
- Data e hora obrigatórias para agendar; **opcional:** não permitir data no passado.
- **Opcional:** não permitir dois agendamentos no **mesmo horário** (regra de negócio).
- Serviço obrigatório se existir lista de serviços.

Mensagens de erro devem ser **claras** e próximas do campo ou em região visível (sem depender só do balão nativo do navegador, se possível).

**Entrega:** formulários com validação demonstrada (print ou vídeo curto, se o professor pedir).

---

### 6. Validar funcionalidades (testes manuais)

Montar um **checklist** de testes e executar **antes** de entregar. Exemplos de itens:

- [ ] Login como cliente e como barbeiro redirecionam corretamente.
- [ ] Logout impede acessar painel sem logar de novo.
- [ ] Cadastro de serviço aparece no select do cliente.
- [ ] Agendamento salva e aparece na lista do barbeiro.
- [ ] Excluir serviço / cancelar agendamento atualiza calendário e tabelas.
- [ ] Recarregar a página mantém dados esperados (localStorage).
- [ ] Calendário: mês anterior/próximo e seleção de dia coerentes com o campo data.

**Entrega:** arquivo `TESTES.md` (ou seção no relatório) com checklist **marcado** e observações de bugs encontrados nos testes.

---

## Ideias extras (opcional / bônus)

Escolham 1 ou mais conforme tempo e nível da turma:

- **Dados de demonstração:** botão “preencher com dados de teste” só em ambiente de desenvolvimento.
- **Exportar / importar** JSON dos agendamentos (backup educativo).
- **Múltiplos barbeiros** (select de profissional no agendamento).
- **Horário de funcionamento** (bloquear horários fora do expediente).
- **README** do projeto: como abrir, estrutura de pastas, tecnologias.
- **Pequena “política de privacidade” fictícia** no rodapé (conscientização sobre dados).
- **Controle de versão:** entregar repositório Git com commits por tarefa (refatoração, login, validação).

---

## Entregáveis 

| Entregável        | Descrição                                      |
|-------------------|------------------------------------------------|
| Código            | Pasta do projeto completa (zip ou repositório). |
| Relatório         | Bugs, refatorações, decisões de UX/UI, limitações do login local. |
| Checklist de testes | `TESTES.md` ou anexo no relatório.          |
| Apresentação oral | 5–10 min por equipe (demo ao vivo).            |

---