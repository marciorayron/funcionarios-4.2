document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM completamente carregado');
    const form = document.getElementById("funcionarioFormulario");
    const modal = document.getElementById("consultarForm");
    const matriculaModal = document.getElementById("matricula-modal");
    const btnVoltar = document.getElementById("btn-voltar");
    const btnSalvar = document.getElementById("btn-salvar");
    const btnEditar = document.getElementById("btn-editar");
    const btnExcluir = document.getElementById("btn-excluir");
    const btnCancelar = document.getElementById("btn-cancelar");
    const btnCadastrar = document.getElementById("btn-cadastrar");

    // Bloquear campos inicialmente
    const toggleFormFields = (enable) => {
        Array.from(form.elements).forEach((field) => {
            field.disabled = !enable;
        });
    };

    toggleFormFields(false); // Bloquear todos os campos ao carregar a página

    // Função para preencher os campos do formulário
    const preencherFormulario = (data) => {
        document.getElementById("nome").value = data.nome || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("whatsapp").value = data.whatsapp || "";
        document.getElementById("telefone").value = data.telefone || "";
        document.getElementById("cep").value = data.cep || "";
        document.getElementById("logradouro").value = data.logradouro || "";
        document.getElementById("numero").value = data.numero || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.cidade || "";
        document.getElementById("estado").value = data.estado || "";
        document.getElementById("matricula").value = data.matricula || "";
        document.getElementById("data_admissao").value = data.data_admissao
            ? new Date(data.data_admissao).toISOString().split("T")[0]
            : ""; // Formata a data para "yyyy-MM-dd"
        document.getElementById("onibus").value = data.onibus || "";
        document.getElementById("ponto_referencia").value = data.ponto_referencia || "";

        // Preencher campos do tipo select, garantindo que o valor seja válido
        preencherSelect("projeto", data.projeto);
        preencherSelect("linha", data.linha);
        preencherSelect("cargo", data.cargo);
        preencherSelect("funcao", data.funcao);
        preencherSelect("turno", data.turno);
    };

    // Função auxiliar para preencher campos select
  // Função auxiliar para preencher campos select
const preencherSelect = (campoId, valor) => {
    const campo = document.getElementById(campoId);
    const opcaoExistente = Array.from(campo.options).some((option) => option.value === valor);

    if (opcaoExistente) {
        campo.value = valor; // Seleciona o valor correspondente
    } else {
        // Se o valor não estiver na lista de opções, adiciona dinamicamente
        const novaOpcao = document.createElement("option");
        novaOpcao.value = valor;
        novaOpcao.textContent = valor;
        campo.appendChild(novaOpcao);
        campo.value = valor; // Seleciona a nova opção
    }
};


    // Função para consultar funcionário pelo número de matrícula
    const consultarFuncionario = async (matricula) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/funcionarios/${matricula}`);

            if (response.data.success) {
                preencherFormulario(response.data.data); // Preenche o formulário com os dados
                toggleFormFields(false); // Desabilita os campos
            } else {
                alert("Funcionário não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao consultar funcionário:", error);
            alert("Erro ao consultar funcionário. Verifique a matrícula e tente novamente.");
        }
    };

    // Evento de submit do modal de consulta
    modal.addEventListener("submit", (event) => {
        event.preventDefault();
        const matricula = matriculaModal.value.trim();
        if (matricula) {
            consultarFuncionario(matricula).then(() => {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById("staticBackdrop1"));
                modalInstance.hide(); // Fecha o modal após a consulta
            });

            btnEditar.style.display = "block";
            btnExcluir.style.display = "block";
            btnVoltar.style.display = "block";
            btnCadastrar.style.display = "none";

        } else {
            alert("Por favor, insira uma matrícula válida.");
        }
    });

    // Função para ativar os campos para edição
    btnEditar.addEventListener("click", () => {
        toggleFormFields(true);
        btnCancelar.style.display = "block";
        btnEditar.style.display = "none";
        btnSalvar.style.display = "block";
        btnExcluir.style.display = "none";
        btnVoltar.style.display = "none";
    });

    // Função para excluir o funcionário
    btnExcluir.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja excluir este funcionário?")) {
            const matricula = document.getElementById("matricula").value;
            excluirFuncionario(matricula);
        }
    });

    // Função para excluir um funcionário
    const excluirFuncionario = async (matricula) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/funcionarios/${matricula}`);
            if (response.data.success) {
                alert("Funcionário excluído com sucesso!");
                // Limpar o formulário após exclusão
                form.reset();
                toggleFormFields(false); // Bloquear novamente os campos
            } else {
                alert("Erro ao excluir funcionário.");
            }
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            alert("Erro ao excluir funcionário.");
        }
    };

    const obterNomeSelecao = (campoId) => {
        const campo = document.getElementById(campoId);
        const opcaoSelecionada = campo.options[campo.selectedIndex];
        return opcaoSelecionada ? opcaoSelecionada.text : '';
    };    

    // Função para salvar as alterações no funcionário
    btnSalvar.addEventListener("click", async () => {
        const funcionarioData = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            whatsapp: document.getElementById("whatsapp").value,
            telefone: document.getElementById("telefone").value,
            cep: document.getElementById("cep").value,
            logradouro: document.getElementById("logradouro").value,
            numero: document.getElementById("numero").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,
            matricula: document.getElementById("matricula").value,
            data_admissao: document.getElementById("data_admissao").value,
            onibus: document.getElementById("onibus").value,
            ponto_referencia: document.getElementById("ponto_referencia").value,
            projeto: obterNomeSelecao("projeto"),
            linha: obterNomeSelecao("linha"),
            cargo: obterNomeSelecao("cargo"),
            funcao: obterNomeSelecao("funcao"),
            turno: obterNomeSelecao("turno")
        };

        try {
            const matricula = document.getElementById("matricula").value;
            const response = await axios.put(`http://localhost:3000/api/funcionarios/${matricula}`, funcionarioData);
            if (response.data.success) {
                alert("Funcionário atualizado com sucesso!");
                toggleFormFields(false);
                btnSalvar.style.display = "none";
                btnExcluir.style.display = "block";
            } else {
                alert("Erro ao salvar as alterações.");
            }
        } catch (error) {
            console.error("Erro ao salvar as alterações:", error);
            alert("Erro ao salvar as alterações.");
        }
    });
});
