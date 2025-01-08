document.addEventListener('DOMContentLoaded', () => {
    // Máscara para os campos de telefone
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        const im = new Inputmask('(99) 99999-9999', {
            clearMaskOnLostFocus: true
        });
        im.mask(input);
    });


    // Adicionar lógica de envio de formulário
    document.getElementById('funcionarioForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obter os dados do formulário
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Mapear os nomes para o envio
        const projetoSelect = document.querySelector('[name="projeto"]');
        const linhaSelect = document.querySelector('[name="linha"]');
        const cargoSelect = document.querySelector('[name="cargo"]');
        const funcaoSelect = document.querySelector('[name="funcao"]');
        const turnoSelect = document.querySelector('[name="turno"]');

        // Adicionar os valores correspondentes ao nome dos campos
        data.projeto = projetoSelect.options[projetoSelect.selectedIndex]?.text || '';
        data.linha = linhaSelect.options[linhaSelect.selectedIndex]?.text || '';
        data.cargo = cargoSelect.options[cargoSelect.selectedIndex]?.text || '';
        data.funcao = funcaoSelect.options[funcaoSelect.selectedIndex]?.text || '';
        data.turno = turnoSelect.options[turnoSelect.selectedIndex]?.text || '';

        // Remover caracteres não numéricos do telefone e WhatsApp
        data.whatsapp = data.whatsapp.replace(/\D/g, '');
        if (data.telefone) {
            data.telefone = data.telefone.replace(/\D/g, '');
        }

        // Validar os números de WhatsApp e telefone
        const phoneRegex = /^\d{2}9\d{8}$/;  // Regex para validar o formato
        const isValidWhatsApp = phoneRegex.test(data.whatsapp);
        const isValidTelefone = phoneRegex.test(data.telefone);

        // Função para identificar o erro específico
        function getErrorMessage(fieldName, value) {
            if (value.length !== 11) {
                return `${fieldName} deve ter exatamente 11 dígitos.`;
            }
            if (!/^\d{2}9/.test(value)) {
                return `${fieldName} deve começar com dois dígitos do código de área seguido do número 9.`;
            }
            return `${fieldName} deve estar no formato correto. Exemplo: (47) 99195-4144`;
        }

        // Verificar se qualquer um dos campos não está no formato correto
        if (!isValidWhatsApp || !isValidTelefone) {
            const fieldName = !isValidWhatsApp ? 'WhatsApp' : 'Telefone';
            const value = !isValidWhatsApp ? data.whatsapp : data.telefone;
            alert(getErrorMessage(fieldName, value));
            return;
        }

        try {
            // Enviar os dados para a API
            const response = await axios.post('http://localhost:3000/api/funcionarios', data);
            alert('Funcionário salvo com sucesso!');
            event.target.reset(); // Resetar o formulário após envio
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            alert('Erro ao salvar funcionário.');
        }
    });
});
