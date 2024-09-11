const senha = document.getElementById("senha");
const button = document.getElementById("botaoSalva");

const buttonTesta = document.getElementById("botaoTestaSenha");

const qtdCertos = document.getElementById("qtdCertos");

let senhaDefinida;
button.addEventListener("click",function(){
    senhaDefinida = senha.value;
    const testaSenhaDiv = document.getElementById("TestaSenha");
    const DefineSenhaDiv = document.getElementById("DefineSenha");
    DefineSenhaDiv.style.display = "none";
    testaSenhaDiv.style.display = "block";
})

buttonTesta.addEventListener("click",function(){
    let senhaTeste = document.getElementById("senhaTentativa").value;
    let certos = 0;

   if(senhaDefinida[0] === senhaTeste[0]){
        certos+=1;
    }
    if(senhaDefinida[1] === senhaTeste[1]){
        certos+=1;
    }
    if(senhaDefinida[2] === senhaTeste[2]){
        certos+=1;
    }
    if(senhaDefinida[3] === senhaTeste[3]){
        certos+=1;
    }
    if(certos === 1){
        qtdCertos.innerHTML = certos + " Certo"
    }
    else{
        qtdCertos.innerHTML = certos + " Certos"
    }
})
