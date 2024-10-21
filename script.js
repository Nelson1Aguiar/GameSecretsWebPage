const senha = document.getElementById("senha");
const button = document.getElementById("botaoSalva");

const buttonTesta = document.getElementById("botaoTestaSenha");

const qtdCertos = document.getElementById("qtdCertos");
const senhaTeste = document.getElementById("senhaTentativa");
const aviso = document.getElementById("Aviso");

let senhaDefinida;

senha.addEventListener("input", function() {
    aviso.innerHTML = '';

    let senhaTesteComparacao = senha.value;

    if (!isNaN(senhaTesteComparacao) && Number(senhaTesteComparacao) > 9999) {
        aviso.innerHTML = "Máximo 4 dígitos";
        senha.value = senhaTesteComparacao.slice(0, -1);
    }
});

senhaTeste.addEventListener("input", function() {
    qtdCertos.innerHTML = '';

    let senhaTesteComparacao = senhaTeste.value;

    if (!isNaN(senhaTesteComparacao) && Number(senhaTesteComparacao) > 9999) {
        qtdCertos.innerHTML = "Máximo 4 dígitos";
        senhaTeste.value = senhaTesteComparacao.slice(0, -1);
    }
});

button.addEventListener("click",function(){
    senhaDefinida = senha.value
    if(Number(senhaDefinida)<1000){
        aviso.innerHTML = "Mínimo 4 dígitos"
        return;
    }
    const testaSenhaDiv = document.getElementById("TestaSenha");
    const DefineSenhaDiv = document.getElementById("DefineSenha");
    DefineSenhaDiv.style.display = "none";
    testaSenhaDiv.style.display = "flex";
})

buttonTesta.addEventListener("click",function(){
    let senhaTesteComparacao = senhaTeste.value

    if(Number(senhaTesteComparacao)<1000){
        qtdCertos.innerHTML = "Mínimo 4 digitos"
        return;
    }

    let certos = 0;

    for(let i=0; i<senhaTesteComparacao.length;i++){
        if(senhaDefinida[i] === senhaTesteComparacao[i]){
            certos+=1;
        }
    }
    if(certos === 1){
        qtdCertos.innerHTML = certos + " Certo"
    }
    else{
        qtdCertos.innerHTML = certos + " Certos"
    }
})
