// public/services/loadOpcoes.js
document.addEventListener('DOMContentLoaded', async () => {
  const projetoSelect = document.getElementById('projeto');
  const linhaSelect = document.getElementById('linha');
  const cargoSelect = document.getElementById('cargo');
  const funcaoSelect = document.getElementById('funcao');
  const turnoSelect = document.getElementById('turno');

  async function fetchOpcoes() {
    // Verificar se as opções estão no localStorage e se ainda são válidas
    const opcoes = obterOpcoesDoLocalStorage();

    if (opcoes) {
      // Se as opções estiverem no localStorage e válidas, preencher os campos
      preencherCamposOpcoes(opcoes);
    } else {
      // Caso contrário, fazer a requisição para obter as opções
      try {
        const response = await axios.get('http://localhost:3000/api/opcoes');
        const { projetos, cargos, funcoes, turnos } = response.data.data;

        // Preencher os campos com os dados da resposta
        preencherCamposOpcoes({ projetos, cargos, funcoes, turnos });

        // Salvar as opções no localStorage com expiração de 5 minutos
        salvarOpcoesNoLocalStorage({ projetos, cargos, funcoes, turnos });
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      }
    }
  }

  function preencherCamposOpcoes(opcoes) {
    // Preencher projetos
    opcoes.projetos.forEach(projeto => {
      const option = new Option(projeto.nome, projeto.id);
      projetoSelect.add(option);
    });

    // Preencher cargos
    opcoes.cargos.forEach(cargo => {
      const option = new Option(cargo.nome, cargo.id);
      cargoSelect.add(option);
    });

    // Preencher funções
    opcoes.funcoes.forEach(funcao => {
      const option = new Option(funcao.nome, funcao.id);
      funcaoSelect.add(option);
    });

    // Preencher turnos
    opcoes.turnos.forEach(turno => {
      const option = new Option(turno.nome, turno.id);
      turnoSelect.add(option);
    });
  }

  // Salvar as opções no localStorage com data de expiração
  function salvarOpcoesNoLocalStorage(opcoes) {
    const dados = {
      opcoes: opcoes,
      expiracao: Date.now() + 300000 // 5 minutos (em milissegundos)
    };
    localStorage.setItem('opcoes', JSON.stringify(dados));
  }

  // Obter as opções do localStorage, se válidas
  function obterOpcoesDoLocalStorage() {
    const opcoesStr = localStorage.getItem('opcoes');
    if (opcoesStr) {
      const opcoes = JSON.parse(opcoesStr);

      // Verificar se os dados ainda são válidos (não expiraram)
      if (opcoes.expiracao > Date.now()) {
        return opcoes.opcoes;
      } else {
        // Se expirou, remover os dados do localStorage
        localStorage.removeItem('opcoes');
      }
    }
    return null; // Não encontrou ou expirou
  }

  // Evento de mudança no projeto para carregar as linhas
  projetoSelect.addEventListener('change', async () => {
    linhaSelect.innerHTML = '<option value="">Selecione uma linha</option>'; // Resetar opções
    const projetoId = projetoSelect.value;
    if (!projetoId) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/linhas/${projetoId}`);
      const { linhas } = response.data.data;

      // Preencher linhas correspondentes
      linhas.forEach(linha => {
        const option = new Option(linha.nome, linha.id);
        linhaSelect.add(option);
      });
    } catch (error) {
      console.error('Erro ao carregar linhas:', error);
    }
  });

  fetchOpcoes();
});
