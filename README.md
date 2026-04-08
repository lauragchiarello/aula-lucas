# Navalha Barbearia — Sistema de Agendamento

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas (ETEC), Módulo 1.  
Trata-se de um protótipo web de agendamento para a barbearia fictícia **Navalha**, com autenticação simulada e dois papéis distintos: **cliente** e **barbeiro**.

---

## Como abrir o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasalexandrino/etec_navalha3ds.git
   cd etec_navalha3ds
   ```
2. Abra o arquivo `index.html` diretamente no navegador (duplo clique ou arraste para o Chrome/Firefox).  
   Não é necessário servidor local — o sistema usa apenas `localStorage` e `sessionStorage`.

---

## Credenciais de acesso (demonstração)

| Papel     | Usuário   | Senha         |
|-----------|-----------|---------------|
| Cliente   | cliente   | cliente123    |
| Barbeiro  | barbeiro  | barbeiro123   |

> **Aviso de segurança:** As credenciais são fixas em código apenas para fins educacionais.  
> Em produção real, a autenticação deve ser feita no servidor com hash seguro (bcrypt, Argon2, etc.).

---

## Estrutura de pastas

```
etec_navalha3ds/
├── index.html          # Estrutura HTML principal (login + painéis)
├── css/
│   └── estilos.css     # Estilos globais, responsividade e acessibilidade
├── js/
│   ├── auth.js         # Autenticação simulada (login/logout/sessão)
│   ├── storage.js      # Camada de acesso ao localStorage
│   ├── calendario.js   # Lógica e renderização do calendário
│   ├── ui-barbeiro.js  # Interface e formulários da área do barbeiro
│   ├── ui-cliente.js   # Interface, validação e formulário do cliente
│   └── app.js          # Orquestrador principal (inicialização e roteamento)
├── README.md           # Este arquivo
├── TESTES.md           # Checklist de testes manuais
└── Contexto.md         # Contexto e objetivos da atividade (fornecido pelo professor)
```

A separação em módulos segue o princípio de **responsabilidade única**: cada arquivo cuida de uma camada específica (autenticação, persistência, calendário, UI por papel, orquestração).

---

## Tecnologias utilizadas

- **HTML5** — estrutura semântica com atributos ARIA para acessibilidade
- **CSS3** — variáveis CSS, Grid Layout, responsividade com media queries
- **JavaScript (ES5/ES6)** — módulos IIFE, sem dependências externas
- **localStorage** — persistência de serviços e agendamentos
- **sessionStorage** — controle de sessão simulada

---

## Bugs corrigidos

| # | Arquivo | Descrição do bug | Correção aplicada |
|---|---------|------------------|-------------------|
| 1 | `index.html` | `<link>` apontava para `css/estilo.css` (sem o "s"), impedindo o carregamento dos estilos | Corrigido para `css/estilos.css` |
| 2 | `css/estilos.css` | Variável `--accentt` (typo com dois "t") na regra `.papel.ativo` | Corrigido para `--accent` |
| 3 | `css/estilos.css` | Variável `--accent-hober` (typo) no hover do `.btn-prim` | Corrigido para `--accent-hover` |
| 4 | `js/app.js` (original) | Navegação do calendário invertida: botão "mês anterior" incrementava o mês e "próximo mês" decrementava | Corrigido em `calendario.js` com lógica de incremento/decremento correta |
| 5 | `js/app.js` (original) | Loop de dias do calendário usava `dia < ultimoDia`, excluindo o último dia do mês | Corrigido para `dia <= ultimoDia` em `calendario.js` |
| 6 | `js/app.js` (original) | `formatarDataHoraBr` usava locale `en-US` em vez de `pt-BR` | Corrigido para formato brasileiro `dd/mm/yyyy às HH:MM` em `ui-barbeiro.js` |
| 7 | `js/app.js` (original) | Formulário de agendamento não validava campos vazios antes de salvar | Adicionada validação completa em `ui-cliente.js` |
| 8 | `js/app.js` (original) | Propriedade dos serviços era `name` (inglês), inconsistente com o resto do código em português | Padronizado para `nome` em `storage.js` |

---

## Melhorias implementadas

### UX e UI
1. **Tela de login** com papéis distintos: o cliente não vê os controles do barbeiro e vice-versa.
2. **Feedback visual** após cada ação (agendamento confirmado, serviço adicionado, erro de validação).
3. **Destaque do dia selecionado** no calendário ao clicar em uma data.

### Validação
- Nome: obrigatório, mínimo 3 caracteres.
- WhatsApp: obrigatório, máscara automática `(DD) 99999-9999`, mínimo 10 dígitos.
- Serviço: obrigatório (select com opção padrão vazia).
- Data: obrigatória, não permite datas passadas.
- Hora: obrigatória, restrita ao horário de funcionamento (08:00–20:00).
- **Regra de negócio:** não permite dois agendamentos no mesmo horário.

### Acessibilidade
- Todos os campos possuem `<label>` associado via `for`/`id`.
- Mensagens de erro usam `aria-live="polite"` para leitores de tela.
- Feedback geral usa `aria-live="assertive"` e `role="alert"`.
- Foco visível em todos os elementos interativos (`:focus-visible`).
- Atributos `aria-label` em botões e regiões principais.

### Responsividade
- Layout em grid adaptativo (uma coluna em mobile, duas em desktop).
- Coluna de WhatsApp oculta em telas muito pequenas para evitar quebra de layout.

---

## Limitações conhecidas

- A autenticação é **simulada** e insegura para uso em produção.
- Os dados ficam apenas no navegador do usuário (sem sincronização entre dispositivos).
- Não há suporte a múltiplos barbeiros.
