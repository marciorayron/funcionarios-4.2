document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('pesquisaForm');
    const matriculaInput = document.getElementById('matricula');
    const modalFuncionario = new bootstrap.Modal(document.getElementById('modalFuncionario'));
    const adicionarFuncionarioBtn = document.getElementById('adicionarFuncionario');
    const listaHorasExtras = document.getElementById('listaHorasExtras');
    const paginaAnteriorBtn = document.getElementById('paginaAnterior');
    const proximaPaginaBtn = document.getElementById('proximaPagina');
    const limparListaBtn = document.getElementById('limparLista');
    const paginaAtualLabel = document.getElementById('paginaAtual');

    let funcionarioData = null;
    let listaFuncionarios = JSON.parse(localStorage.getItem('listaFuncionarios')) || [];
    let paginaAtual = 1;
    const porPagina = 10;

    // Função para exibir os dados na tabela
    const exibirLista = () => {
        listaHorasExtras.innerHTML = '';
        const listaPagina = listaFuncionarios.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

        listaPagina.forEach(funcionario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${funcionario.matricula}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.funcao}</td>
                <td>${funcionario.logradouro}</td>
                <td>${funcionario.numero}</td>
                <td>${funcionario.bairro}</td>
                <td>${funcionario.cidade}</td>
                <td>${funcionario.onibus}</td>
                <td>${funcionario.ponto_referencia}</td>
                <td><button class="btn btn-danger" onclick="removerFuncionario(this)">Remover</button></td>
            `;
            listaHorasExtras.appendChild(row);
        });

        // Atualizar visibilidade dos botões de navegação
        proximaPaginaBtn.disabled = paginaAtual * porPagina >= listaFuncionarios.length;
        paginaAnteriorBtn.disabled = paginaAtual === 1;

        // Calcular o total de páginas
        const totalPaginas = Math.ceil(listaFuncionarios.length / porPagina);
        paginaAtualLabel.innerText = `Página ${paginaAtual} de ${totalPaginas}`;

        // Salvar lista no localStorage
        localStorage.setItem('listaFuncionarios', JSON.stringify(listaFuncionarios));
    };

    // Função para buscar os dados do funcionário
    const buscarFuncionario = async (matricula) => {
        try {
            const response = await axios.get(`http://https://marciorayron.com/api/funcionarios/${matricula}`);
            if (response.data.success) {
                funcionarioData = response.data.data;
                document.getElementById('nomeFuncionario').innerText = funcionarioData.nome;
                document.getElementById('matriculaFuncionario').innerText = funcionarioData.matricula;
                document.getElementById('onibusFuncionario').innerText = funcionarioData.onibus;
                document.getElementById('pontoFuncionario').innerText = funcionarioData.ponto_referencia;
                modalFuncionario.show();
            } else {
                alert("Funcionário não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao buscar funcionário:", error);
            alert("Erro ao buscar funcionário.");
        }
    };

    // Função para adicionar funcionário na lista de horas extras
    const adicionarFuncionarioNaLista = () => {
        listaFuncionarios.push(funcionarioData);
        exibirLista();
        modalFuncionario.hide();
    };

    // Função para remover um funcionário da lista
    window.removerFuncionario = (button) => {
        const row = button.closest('tr');
        const matricula = row.cells[0].innerText;
        listaFuncionarios = listaFuncionarios.filter(funcionario => funcionario.matricula !== matricula);
        exibirLista();
    };

    // Função para navegar para a página anterior
    paginaAnteriorBtn.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            exibirLista();
        }
    });

    // Função para navegar para a próxima página
    proximaPaginaBtn.addEventListener('click', () => {
        const totalPaginas = Math.ceil(listaFuncionarios.length / porPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            exibirLista();
        }
    });

    // Função para limpar a lista de funcionários
    limparListaBtn.addEventListener('click', () => {
        const confirmacao = confirm("Tem certeza que deseja apagar todos os registros?");
        if (confirmacao) {
            listaFuncionarios = [];
            exibirLista();
        }
    });

    // Evento de submit para o formulário de pesquisa
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const matricula = matriculaInput.value.trim();
        if (matricula) {
            buscarFuncionario(matricula);
        } else {
            alert("Digite uma matrícula válida.");
        }
    });

    // Evento de click para adicionar funcionário na lista de horas extras
    adicionarFuncionarioBtn.addEventListener('click', adicionarFuncionarioNaLista);

    // Exibir a lista ao carregar a página
    exibirLista();

    // Criação da planilha
    const gerarExcel = () => {
        const rows = listaFuncionarios.map(funcionario => ({
            matricula: funcionario.matricula,
            nome: funcionario.nome,
            funcao: funcionario.funcao,
            endereco: funcionario.logradouro,
            numero: funcionario.numero,
            bairro: funcionario.bairro,
            cidade: funcionario.cidade,
            onibus: funcionario.onibus,
            ponto_referencia: funcionario.ponto_referencia
        }));

        const ws = XLSX.utils.json_to_sheet(rows);

        // Definir os cabeçalhos
        const header = ['Matricula', 'Nome', 'Função', 'Endereço', 'Numero', 'Bairro', 'Cidade', 'Ônibus', 'Ponto de Referencia'];
        header.forEach((text, index) => {
            const cell = ws[XLSX.utils.encode_cell({ r: 0, c: index })] || {};
            cell.v = text;
            ws[XLSX.utils.encode_cell({ r: 0, c: index })] = cell;
        });

        // Ajuste de largura das colunas
        const colWidths = rows[0] ? Object.keys(rows[0]).map(key => ({
            wch: Math.max(...rows.map(row => row[key].length)) + 3 // Adiciona margem
        })) : [];
        ws['!cols'] = colWidths;

        // Criar a planilha e salvar o arquivo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Horas Extras");
        XLSX.writeFile(wb, 'Horas_Extras.xlsx');

    };

    // Adiciona evento de clique para o botão de download
    document.getElementById('baixarExcel').addEventListener('click', gerarExcel);
});
