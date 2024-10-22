const senha = document.getElementById("senha");
const button = document.getElementById("botaoSalva");

const buttonTesta = document.getElementById("botaoTestaSenha");

const senhaTeste = document.getElementById("senhaTentativa");

const textResponse = document.getElementById("textResponse");

let senhaDefinida;

let teclas = [];

for (let i = 0; i < 4; i++) {
    teclas[i] = [];
    for (let j = 0; j < 9; j++) {
        let tecla = document.getElementById(`Tecla${j}Coluna${i}`);
        if (tecla) {
            tecla.addEventListener('click', function() {
                const currentColor = tecla.style.backgroundColor;
                if (currentColor === 'green' || currentColor === '') {
                    tecla.style.backgroundColor = 'yellow';
                } else if (currentColor === 'yellow') {
                    tecla.style.backgroundColor = 'red';
                } else {
                    tecla.style.backgroundColor = 'green';
                }
            });
            teclas[i].push(tecla);
        } else {
            console.warn(`Tecla com id Tecla${j}Coluna${i} não encontrada.`);
        }
    }
}

senha.addEventListener("input", function() {
    textResponse.innerHTML = '';

    let senhaTesteComparacao = senha.value;

    if (!isNaN(senhaTesteComparacao) && Number(senhaTesteComparacao) > 9999) {
        textResponse.innerHTML = "Máximo 4 dígitos";
        senha.value = senhaTesteComparacao.slice(0, -1);
    }
});

senhaTeste.addEventListener("input", function() {
    textResponse.innerHTML = '';

    let senhaTesteComparacao = senhaTeste.value;

    if (!isNaN(senhaTesteComparacao) && Number(senhaTesteComparacao) > 9999) {
        textResponse.innerHTML = "Máximo 4 dígitos";
        senhaTeste.value = senhaTesteComparacao.slice(0, -1);
    }
});

button.addEventListener("click",function(){
    senhaDefinida = senha.value
    if(senhaDefinida.length<4){
        textResponse.innerHTML = "Mínimo 4 dígitos"
        return;
    }
    const testaSenhaDiv = document.getElementById("TestaSenha");
    const DefineSenhaDiv = document.getElementById("DefineSenha");
    DefineSenhaDiv.style.display = "none";
    testaSenhaDiv.style.display = "flex";
})

buttonTesta.addEventListener("click",function(){
    let senhaTesteComparacao = senhaTeste.value

    if(senhaTesteComparacao.length<4){
        textResponse.innerHTML = "Mínimo 4 digitos"
        return;
    }

    let certos = 0;

    for(let i=0; i<senhaTesteComparacao.length;i++){
        if(senhaDefinida[i] === senhaTesteComparacao[i]){
            certos+=1;
        }
    }
    if(certos === 1){
        textResponse.innerHTML = certos + " Certo"
    }
    else{
        textResponse.innerHTML = certos + " Certos"
    }
})
