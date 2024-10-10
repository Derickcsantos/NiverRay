document.getElementById('save-color').addEventListener('click', function() {
    const color = document.getElementById('color-picker').value;

    // Chamada para o backend para salvar a cor
    fetch('/api/save-color', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ color: color })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cor salva:', data);
    })
    .catch(error => {
        console.error('Erro ao salvar a cor:', error);
    });
});

// Carregar a cor ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/get-color')
        .then(response => response.json())
        .then(data => {
            document.body.style.setProperty('--bg-color', data.color);
        });
});
