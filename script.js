const senha = document.getElementById("senha");
const button = document.getElementById("botaoSalva");

const buttonTesta = document.getElementById("botaoTestaSenha");

const senhaTeste = document.getElementById("senhaTentativa");

const textResponse = document.getElementById("textResponse");

let senhaDefinida;

let teclas = [];

let teclasBackup = [[],[],[],[]]

for (let i = 0; i < 4; i++) {
    teclas[i] = [];
    for (let j = 0; j <= 9; j++) {
        let tecla = document.getElementById(`Tecla${j}Coluna${i}`);
        if (tecla) {
            tecla.dataset.column = i;
            tecla.dataset.row = j;
            tecla.addEventListener('click', ChangeColor); 
            teclas[i].push(tecla);
        } else {
            console.warn(`Tecla com id Tecla${j}Coluna${i} não encontrada.`);
        }
    }
}

function ChangeColor(event) {
    const tecla = event.target;
    const currentColor = tecla.style.backgroundColor;

    const i = tecla.dataset.column;
    const j = tecla.dataset.row;

    if (currentColor === 'white' || currentColor === '') {
        tecla.style.backgroundColor = 'yellow';
    } else if (currentColor === 'yellow') {
        tecla.style.backgroundColor = 'red';
    } else if (currentColor === 'red') {
        tecla.style.backgroundColor = 'green';
        BlockOtherButtons(i, j);
    } else {
        tecla.style.backgroundColor = 'white';
        UnlockButtons(i,j)
    }
}

const BlockOtherButtons = (i, j) => {

    teclasBackup[i] = teclas[i].map(tecla => ({
        backgroundColor: tecla.style.backgroundColor,
        opacity: tecla.style.opacity,
    }));

    teclas[i].forEach((tecla, index) => {
        if (index !== parseInt(j)) {
            tecla.style.backgroundColor = "rgb(113, 110, 110)";
            tecla.style.opacity = "0.5";
            tecla.removeEventListener("click", ChangeColor);
        }
    });
};


const UnlockButtons = (i, j) => {
    teclas[i].forEach((tecla, index) => {
        if (index !== parseInt(j)) {
            tecla.style.backgroundColor = teclasBackup[i][index].backgroundColor;
            tecla.style.opacity = teclasBackup[i][index].opacity;
            tecla.addEventListener("click", ChangeColor);
        }
    });

    teclasBackup[i] = [];
};

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
