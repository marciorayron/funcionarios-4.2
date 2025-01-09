const apiUrl = "http://localhost:3000/api/funcionarios";
const tabela = document.getElementById("listaFuncionarios");
const paginaAtualSpan = document.getElementById("paginaAtual");
const btnAnterior = document.getElementById("paginaAnterior");
const btnProxima = document.getElementById("proximaPagina");

// Campos de filtro
const filtroNome = document.getElementById("filtroNome");
const filtroFuncao = document.getElementById("filtroFuncao");
const filtroCargo = document.getElementById("filtroCargo");
const filtroLinha = document.getElementById("filtroLinha");
const filtroProjeto = document.getElementById("filtroProjeto");
const btnLimparFiltros = document.getElementById("limparFiltros");

let paginaAtual = 1;
const resultadosPorPagina = 10;
let funcionariosCache = []; // Para armazenar os dados da API

// Função para carregar funcionários
async function carregarFuncionarios(pagina) {
    try {
        const { data } = await axios.get(apiUrl, {
            params: { page: pagina, limit: resultadosPorPagina }
        });

        funcionariosCache = data.data; // Armazenar os dados para aplicar filtros

        // Atualizar opções de filtro
        atualizarFiltros(funcionariosCache);

        // Aplicar filtros
        aplicarFiltros();

        const totalPaginas = Math.ceil(funcionariosCache.length / resultadosPorPagina);
        paginaAtualSpan.textContent = `Página ${pagina} de ${totalPaginas}`;
        btnAnterior.disabled = pagina === 1;
        btnProxima.disabled = pagina === totalPaginas;
    } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
        alert("Erro ao carregar funcionários. Verifique a API.");
    }
}

// Atualizar os filtros com base nos dados recebidos
function atualizarFiltros(funcionarios) {
    const funcoes = [...new Set(funcionarios.map(f => f.funcao))];
    const cargos = [...new Set(funcionarios.map(f => f.cargo))];
    const linhas = [...new Set(funcionarios.map(f => f.linha))];
    const projetos = [...new Set(funcionarios.map(f => f.projeto))];

    // Preencher os filtros com as opções
    preencherFiltro(filtroFuncao, funcoes);
    preencherFiltro(filtroCargo, cargos);
    preencherFiltro(filtroLinha, linhas);
    preencherFiltro(filtroProjeto, projetos);
}

// Preencher o select de filtros
function preencherFiltro(selectElement, opcoes) {
    selectElement.innerHTML = `<option value="">Todos</option>`; // Limpar e adicionar a opção "Todos"
    opcoes.forEach(opcao => {
        const option = document.createElement("option");
        option.value = opcao;
        option.textContent = opcao;
        selectElement.appendChild(option);
    });
}

// Aplicar filtros nos dados
function aplicarFiltros() {
    let funcionariosFiltrados = funcionariosCache;

    // Filtro por Nome
    if (filtroNome.value) {
        funcionariosFiltrados = funcionariosFiltrados.filter(f => f.nome.toLowerCase().includes(filtroNome.value.toLowerCase()));
    }

    // Filtrar com base nos valores selecionados
    if (filtroFuncao.value) {
        funcionariosFiltrados = funcionariosFiltrados.filter(f => f.funcao === filtroFuncao.value);
    }
    if (filtroCargo.value) {
        funcionariosFiltrados = funcionariosFiltrados.filter(f => f.cargo === filtroCargo.value);
    }
    if (filtroLinha.value) {
        funcionariosFiltrados = funcionariosFiltrados.filter(f => f.linha === filtroLinha.value);
    }
    if (filtroProjeto.value) {
        funcionariosFiltrados = funcionariosFiltrados.filter(f => f.projeto === filtroProjeto.value);
    }

    // Ordenar os funcionários por nome (alfabeticamente)
    funcionariosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));

    // Atualizar a tabela
    tabela.innerHTML = "";
    funcionariosFiltrados.forEach(funcionario => {
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
}

// Eventos de filtro
filtroNome.addEventListener("input", aplicarFiltros);  // Evento para o filtro de nome
filtroFuncao.addEventListener("change", aplicarFiltros);
filtroCargo.addEventListener("change", aplicarFiltros);
filtroLinha.addEventListener("change", aplicarFiltros);
filtroProjeto.addEventListener("change", aplicarFiltros);

// Botão de limpar filtros
btnLimparFiltros.addEventListener("click", () => {
    // Limpar os filtros
    filtroNome.value = "";
    filtroFuncao.value = "";
    filtroCargo.value = "";
    filtroLinha.value = "";
    filtroProjeto.value = "";

    // Recarregar os funcionários sem filtros
    aplicarFiltros();
});

// Navegação de páginas
btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
        carregarFuncionarios(--paginaAtual);
    }
});

btnProxima.addEventListener("click", () => {
    carregarFuncionarios(++paginaAtual);
});

// Carregar a primeira página ao inicializar
carregarFuncionarios(paginaAtual);
