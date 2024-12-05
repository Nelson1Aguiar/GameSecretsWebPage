const senhaTeste = document.getElementById("senhaTentativa");
const textResponse = document.getElementById("textResponse");
const statusTurno = document.getElementById("turnoStatus");
const inputPass = document.getElementById("DefinirSenhaAdversario");
const buttonTesta = document.getElementById("botaoTestaSenha");
const sideBar = document.getElementById("sidebar");
const playerName = document.getElementById("namePlayerInit");
const password = document.getElementById("passwordInit");

let player;

let teclasBackup = [[], [], [], []];
let teclas = [];

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
        UnlockButtons(i, j);
    }
}

const BlockOtherButtons = (i, j) => {
    teclasBackup[i] = teclas[i].map(tecla => ({
        backgroundColor: tecla.style.backgroundColor,
    }));

    teclas[i].forEach((tecla, index) => {
        if (index !== parseInt(j)) {
            tecla.style.backgroundColor = "rgb(57, 54, 54)";
            tecla.removeEventListener("click", ChangeColor);
        }
    });
};

const UnlockButtons = (i, j) => {
    teclas[i].forEach((tecla, index) => {
        if (index !== parseInt(j)) {
            tecla.style.backgroundColor = teclasBackup[i][index].backgroundColor;
            tecla.addEventListener("click", ChangeColor);
        }
    });

    teclasBackup[i] = [];
};

const moveScreen = () => {
    containerInit.classList.add("hide");
    mainContainer.classList.add("show");
}

const moveScreenToLogin = () => {
    containerInit.classList.remove("hide");
    mainContainer.classList.remove("show");

    senhaTeste.value = '';
}

initPlayerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const apiUrl = "https://gamesecretsapi.onrender.com/Game/InitPlayer";

    const statusElement = document.getElementById("status");

    statusElement.textContent = "Aguardando adversário...";

    GameStartPlayer = {
        Player: playerName.value,
        Password: password.value
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(GameStartPlayer)
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
            moveScreen();

            password.value = '';
            statusElement.textContent = '';

            if (data.player1 === playerName.value) {
                player = {
                    isYourTurn: true,
                    name: playerName.value
                }
            } else {
                player = {
                    isYourTurn: false,
                    name: playerName.value
                }

                awaitYourTurn();
            }
        } else {
            statusElement.textContent = `Erro: ${data.message}`;
        }
    } catch (error) {
        console.error("Erro ao aguardar jogador 2:", error);
        statusElement.textContent = "Erro ao conectar-se ao servidor.";
    }
});

const awaitYourTurn = async () => {
    buttonTesta.disabled = true;
    buttonTesta.classList.add('disabled');

    statusTurno.textContent = "Aguarde sua rodada...";

    const apiUrl = `https://gamesecretsapi.onrender.com/Game/CurrentTurn/${player.name}`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
            statusTurno.textContent = `${data.lastTurnPlayer} acertou ${data.rightNumbers} dígitos`;

            buttonTesta.disabled = false;
            buttonTesta.classList.remove('disabled');

            if (data.rightNumbers === 4) {
                alert(`${data.lastTurnPlayer} é o vencedor`);
                moveScreenToLogin();
                resetHistoric();
                statusTurno.textContent = '';
                textResponse.innerHTML = '';
            }

        } else {
            console.log(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error("Erro ao aguardar turno", error);
    }
}

const playYourTurn = async (senhaTesteComparacao) => {
    const apiUrl = "https://gamesecretsapi.onrender.com/Game/PlayTurn";

    GameStartPlayer = {
        Player: player.name,
        Password: senhaTesteComparacao
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(GameStartPlayer)
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
            textResponse.innerHTML = `${data.numerosCertos} certos`;

            if (data.numerosCertos === 4) {
                alert(`Você venceu! A senha é ${GameStartPlayer.Password}`);
                resetHistoric();
                moveScreenToLogin();
                statusTurno.textContent = '';
                textResponse.innerHTML = '';
            }
            else {
                let tentativa = {
                    senha: senhaTesteComparacao,
                    numCertos: data.numerosCertos
                }

                SaveInHistoric(tentativa);
                awaitYourTurn();

                senhaTeste.value = '';
            }
        } else {
            console.log(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error("Erro ao jogar turno:", error);
    }
}

const resetHistoric = () => {
    const historicContainers = sideBar.querySelectorAll('.containerHistoric');
    historicContainers.forEach(container => {
        container.remove();
    });
}

senhaTeste.addEventListener("input", function () {
    textResponse.innerHTML = '';

    let senhaTesteComparacao = senhaTeste.value;

    senhaTeste.value = senhaTesteComparacao.replace(/[a-zA-Z\s\W]/g, "");

    if (!isNaN(senhaTesteComparacao) && Number(senhaTesteComparacao) > 9999) {
        textResponse.innerHTML = "Máximo 4 dígitos";
        senhaTeste.value = senhaTesteComparacao.slice(0, -1);
    }
});

inputPass.addEventListener("input", function () {
    let senhaAux = inputPass.value;

    inputPass.value = senhaAux.replace(/[a-zA-Z\s\W]/g, "");

    if (!isNaN(senhaAux) && Number(senhaAux) > 9999) {
        inputPass.value = senhaAux.slice(0, -1);
    }
});

password.addEventListener("input", function () {
    let senhaAux = password.value;

    password.value = senhaAux.replace(/[a-zA-Z\s\W]/g, "");

    if (!isNaN(senhaAux) && Number(senhaAux) > 9999) {
        password.value = senhaAux.slice(0, -1);
    }
});

function mostrarSenhaCriar() {
    const btnShowPass = document.getElementById("btn-senha");

    if (inputPass.type === "password") {
        inputPass.type = "number";
        inputPass.removeAttribute("disabled");
        btnShowPass.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
    } else {
        inputPass.type = "password";
        inputPass.setAttribute("disabled", true)
        btnShowPass.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
    }
}

buttonTesta.addEventListener("click", function () {
    let senhaTesteComparacao = senhaTeste.value

    if (senhaTesteComparacao.length < 4) {
        textResponse.innerHTML = "Mínimo 4 digitos";
        return;
    }

    playYourTurn(senhaTesteComparacao);
})

const SaveInHistoric = (tentativa) => {
    const divContainer = document.createElement("div");
    const senha = document.createElement("h2");
    const numCertos = document.createElement("h3");

    senha.innerHTML = `Senha: ${tentativa.senha}`;
    numCertos.innerHTML = `Certos: ${tentativa.numCertos}`;

    divContainer.classList.add("containerHistoric");

    divContainer.appendChild(senha);
    divContainer.appendChild(numCertos);
    sideBar.appendChild(divContainer);
}

const toggleMenu = () => {
    sideBar.classList.add("active");
}

const toggleSidebar = () => {
    sideBar.classList.remove("active");
}

const clearInput = (inputId) => {
    if (inputId === 'senhaTentativa') {
        senhaTeste.value = '';
    }
}