const baseURL = "https://jsonplaceholder.typicode.com/posts";

// ── Helpers ──────────────────────────────────────────────

function pegarCampos() {
  return {
    nome_evento:          document.getElementById("nome_evento").value.trim(),
    descricao:            document.getElementById("descricao").value.trim(),
    data_inicio:          document.getElementById("data_inicio").value,
    data_fim:             document.getElementById("data_fim").value,
    local:                document.getElementById("local").value.trim(),
    limite_participantes: document.getElementById("limite_participantes").value,
  };
}

function validar(e) {
  if (!e.nome_evento || !e.descricao || !e.data_inicio || !e.data_fim || !e.local || !e.limite_participantes)
    return { status: 400, erro: "Preencha todos os campos obrigatórios." };
  if (e.nome_evento.length < 5)
    return { status: 400, erro: "Nome do evento: mínimo 5 caracteres." };
  if (e.descricao.length < 10)
    return { status: 400, erro: "Descrição: mínimo 10 caracteres." };
  if (e.local.length < 5)
    return { status: 400, erro: "Local: mínimo 5 caracteres." };
  if (new Date(e.data_fim) < new Date(e.data_inicio))
    return { status: 400, erro: "Data de término não pode ser anterior à data de início." };
  if (Number(e.limite_participantes) < 1)
    return { status: 400, erro: "Limite de participantes deve ser maior que 0." };
  return null;
}

function log(metodo, status, payload) {
  const cores = { 200: "color:#22c55e", 201: "color:#16a34a", 400: "color:#f97316", 404: "color:#ef4444", 409: "color:#a855f7" };
  console.group(`%c${metodo} — ${status}`, `${cores[status] ?? "color:gray"};font-weight:bold`);
  console.log(payload);
  console.groupEnd();
}

function eventosLocais() {
  return JSON.parse(localStorage.getItem("eventos") || "[]");
}

// ── GET ───────────────────────────────────────────────────

async function getAll() {
  const res  = await fetch(baseURL);
  const data = await res.json();
  log("GET - Todos os eventos", 200, { status: 200, total: data.length, dados: data });
}

async function getById(id) {
  const res = await fetch(`${baseURL}/${id}`);
  if (!res.ok) return log("GET - Por ID", 404, { status: 404, mensagem: `Evento ID ${id} não encontrado.` });
  log("GET - Por ID", 200, { status: 200, dados: await res.json() });
}

// ── POST ──────────────────────────────────────────────────

async function SalvarEvento() {
  const evento = pegarCampos();
  const erro   = validar(evento);

  if (erro) {
    alert(erro.erro);
    return log("POST - Criar evento", 400, { status: 400, mensagem: erro.erro, dados_enviados: evento });
  }

  const duplicado = eventosLocais().find(e => e.nome_evento.toLowerCase() === evento.nome_evento.toLowerCase());
  if (duplicado) {
    alert(`Conflito: já existe um evento com o nome "${evento.nome_evento}".`);
    return log("POST - Criar evento", 409, { status: 409, mensagem: "Nome de evento duplicado." });
  }

  const res  = await fetch(baseURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(evento) });
  const data = await res.json();

  localStorage.setItem("eventos", JSON.stringify([...eventosLocais(), { ...evento, id: data.id }]));
  alert("Evento criado com sucesso!");
  log("POST - Criar evento", 201, { status: 201, mensagem: "Evento criado.", dados: { id: data.id, ...evento } });
}

// ── PUT ───────────────────────────────────────────────────

async function AtualizarEvento() {
  const id     = document.getElementById("evento_id").value;
  const evento = pegarCampos();
  const erro   = validar(evento);

  if (!id)  { alert("Informe o ID do evento para atualizar."); return log("PUT - Atualizar", 400, { status: 400, mensagem: "ID não informado." }); }
  if (erro) { alert(erro.erro); return log("PUT - Atualizar", 400, { status: 400, mensagem: erro.erro }); }

  const res = await fetch(`${baseURL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...evento }) });
  if (!res.ok) return log("PUT - Atualizar", 404, { status: 404, mensagem: `Evento ID ${id} não encontrado.` });

  alert("Evento atualizado com sucesso!");
  log("PUT - Atualizar", 200, { status: 200, mensagem: "Evento atualizado.", dados: await res.json() });
}

// ── DELETE ────────────────────────────────────────────────

async function DeletarEvento() {
  const id = document.getElementById("evento_id").value;
  if (!id) { alert("Informe o ID do evento para remover."); return log("DELETE - Remover", 400, { status: 400, mensagem: "ID não informado." }); }

  const res = await fetch(`${baseURL}/${id}`, { method: "DELETE" });
  if (!res.ok) return log("DELETE - Remover", 404, { status: 404, mensagem: `Evento ID ${id} não encontrado.` });

  localStorage.setItem("eventos", JSON.stringify(eventosLocais().filter(e => String(e.id) !== String(id))));
  alert(`Evento ID ${id} removido com sucesso.`);
  log("DELETE - Remover", 200, { status: 200, mensagem: `Evento ID ${id} removido.` });
}

// JSON e DTOS

function SalvarEvento() {
    const nome = document.getElementById("nome_evento").value;
    const descricao = document.getElementById("descricao").value;
    const data_inicio = document.getElementById("data_inicio").value;
    const data_fim = document.getElementById("data_fim").value;
    const local = document.getElementById("local").value;
    const limite_participantes = document.getElementById("limite_participantes").value;

    if(nome == null || descricao == null || data_inicio == null || data_fim == null || local == null || limite_participantes == null){
        mensagem.innerText = "Nâo foi possível criar um novo evento, preencha todos os campos indicados";
    }
}


class CriarEventoDTO {
    constructor({ nome, descricao, dataInicio, dataFim, local, limiteParticipantes }) {
        this.nome = nome;
        this.descricao = descricao;
        this.data_inicio = dataInicio;
        this.data_fim = dataFim;
        this.local = local;
        this.limite_participantes = Number(limiteParticipantes);
    }

    validar() {
        return (
            this.nome && 
            this.descricao && 
            this.data_inicio && 
            this.data_fim && 
            this.local && 
            !isNaN(this.limite_participantes) &&
            this.limite_participantes > 0 
        );
    }
}

function SalvarEvento(event) {
    if (event) event.preventDefault();

    const eventoDTO = new CriarEventoDTO({
        nome: document.getElementById("nome_evento").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        dataInicio: document.getElementById("data_inicio").value,
        dataFim: document.getElementById("data_fim").value,
        local: document.getElementById("local").value.trim(),
        limiteParticipantes: document.getElementById("limite_participantes").value
    });

    let elementoMensagem = document.getElementById("mensagem-feedback");
    if (!elementoMensagem) {
        elementoMensagem = document.createElement("p");
        elementoMensagem.id = "mensagem-feedback";
        document.querySelector("form").appendChild(elementoMensagem);
    }

    if (!eventoDTO.validar()) {
        elementoMensagem.innerText = "Não foi possível criar um novo evento, preencha todos os campos indicados.";
        elementoMensagem.style.color = "#ff4d4d";
        return;
    }

    
    elementoMensagem.innerText = "Evento criado com sucesso!";
    elementoMensagem.style.color = "#2ecc71"; 

    
    console.log(eventoDTO);
}