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

    
    console.log("DTO gerado com sucesso:", eventoDTO);
}