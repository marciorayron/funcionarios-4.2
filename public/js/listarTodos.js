const apiUrl = "http://localhost:3000/api/funcionarios";
const tabela = document.getElementById("listaFuncionarios");
const paginaAtualSpan = document.getElementById("paginaAtual");
const btnAnterior = document.getElementById("paginaAnterior");
const btnProxima = document.getElementById("proximaPagina");

let paginaAtual = 1;
const resultadosPorPagina = 10;

async function carregarFuncionarios(pagina) {
    try {
        const { data } = await axios.get(apiUrl, {
            params: { page: pagina, limit: resultadosPorPagina }
        });

        const funcionarios = data.data; // Ajustando para usar a propriedade correta
        tabela.innerHTML = "";

        funcionarios.forEach(funcionario => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${funcionario.matricula}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.funcao}</td>
                <td>${funcionario.cargo}</td>
                <td>${funcionario.linha}</td>
                <td>${funcionario.projeto}</td>
            `;
            tabela.appendChild(tr);
        });

        const totalPaginas = Math.ceil(funcionarios.length / resultadosPorPagina);
        paginaAtualSpan.textContent = `Página ${pagina} de ${totalPaginas}`;
        btnAnterior.disabled = pagina === 1;
        btnProxima.disabled = pagina === totalPaginas;
    } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
        alert("Erro ao carregar funcionários. Verifique a API.");
    }
}

btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
        carregarFuncionarios(--paginaAtual);
    }
});

btnProxima.addEventListener("click", () => {
    carregarFuncionarios(++paginaAtual);
});

// Carrega a primeira página ao inicializar
carregarFuncionarios(paginaAtual);
