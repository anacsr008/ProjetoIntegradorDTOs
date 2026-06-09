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

