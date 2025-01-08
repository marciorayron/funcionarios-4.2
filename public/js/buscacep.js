// buscacep.js

function buscarEndereco() {
    var cep = document.getElementById("cep").value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Verifica se o CEP tem 8 dígitos
    if (cep.length === 8) {
        // Verificar se o endereço já está no localStorage e se ainda é válido (não expirou)
        const endereco = obterEnderecoDoLocalStorage(cep);

        if (endereco) {
            // Se os dados estiverem no localStorage e válidos, preenche os campos
            preencherCamposEndereco(endereco);
        } else {
            // Caso não haja dados ou estejam expirados, faz a requisição à API ViaCEP
            var url = `https://viacep.com.br/ws/${cep}/json/`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        alert("CEP não encontrado!");
                    } else {
                        // Preenche os campos do formulário
                        preencherCamposEndereco(data);
                        
                        // Armazenar dados no localStorage com expiração de 1 hora
                        salvarEnderecoNoLocalStorage(cep, data);
                    }
                })
                .catch(error => {
                    alert("Erro ao buscar o endereço. Tente novamente.");
                    console.error(error);
                });
        }
    }
}

// Preencher os campos do formulário
function preencherCamposEndereco(data) {
    document.getElementById("logradouro").value = data.logradouro;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("cidade").value = data.localidade;
    document.getElementById("estado").value = data.uf;
}

// Salvar dados no localStorage com data de expiração
function salvarEnderecoNoLocalStorage(cep, data) {
    const endereco = {
        data: data,
        expiracao: Date.now() + 3600000 // 1 hora (em milissegundos)
    };
    localStorage.setItem(`endereco_${cep}`, JSON.stringify(endereco));
}

// Obter dados do localStorage, se válidos
function obterEnderecoDoLocalStorage(cep) {
    const enderecoStr = localStorage.getItem(`endereco_${cep}`);
    if (enderecoStr) {
        const endereco = JSON.parse(enderecoStr);
        
        // Verificar se o dado ainda é válido
        if (endereco.expiracao > Date.now()) {
            return endereco.data;
        } else {
            // Se expirou, remover os dados do localStorage
            localStorage.removeItem(`endereco_${cep}`);
        }
    }
    return null; // Não encontrou ou expirou
}
