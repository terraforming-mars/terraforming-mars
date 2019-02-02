
function showCreateGameForm(): void {
    const maxPlayers: number = 5;
    const elForm = document.createElement("form");
    const elLabelName = document.createElement("label");
    elLabelName.innerHTML = "Name:";
    const elInputName = document.createElement("input");
    elInputName.type = "text";
    elInputName.value += "Game" + Math.floor(Math.random() * 12345151);
    const elCreateGameBtn = document.createElement("input");
    elCreateGameBtn.type = "button";
    elCreateGameBtn.value = "Create Game";
    elForm.appendChild(elLabelName);
    elForm.appendChild(elInputName);
    for (let i: number = 0; i < maxPlayers; i++) {
        const elLabelPlayer = document.createElement("label");
        elLabelPlayer.innerHTML = "Player " + (i + 1) + " Name:";
        const elInputPlayer = document.createElement("input");
        elInputPlayer.name = "playerName" + i;
        elInputPlayer.type = "text";
        const elColorPlayer = document.createElement("select");
        const elOptionRed = document.createElement("option");
        elOptionRed.innerHTML = "Red";
        elOptionRed.value = "red";
        elColorPlayer.appendChild(elOptionRed); 
        const elOptionGreen = document.createElement("option");
        elOptionGreen.innerHTML = "Green";
        elOptionGreen.value = "green";
        elColorPlayer.appendChild(elOptionGreen); 
        const elOptionYellow = document.createElement("option");
        elOptionYellow.innerHTML = "Yellow";
        elOptionYellow.value = "yellow";
        elColorPlayer.appendChild(elOptionYellow); 
        const elOptionBlue = document.createElement("option");
        elOptionBlue.innerHTML = "Blue";
        elOptionBlue.value = "blue";
        elColorPlayer.appendChild(elOptionBlue); 
        const elOptionBlack = document.createElement("option");
        elOptionBlack.innerHTML = "Black";
        elOptionBlack.value = "black";
        elColorPlayer.appendChild(elOptionBlack); 
        elColorPlayer.selectedIndex = i;
        elColorPlayer.name = "playerColor" + i;
        elForm.appendChild(elLabelPlayer);
        elForm.appendChild(elInputPlayer);
        elForm.appendChild(elColorPlayer);
    }
    elCreateGameBtn.onclick = function () {
        const gameName: string = elInputName.value;
        const players: Array<{[x: string]: string}> = [];
        for (let i: number = 0; i < maxPlayers; i++) {
            players.push({
                name: (elForm.elements as any)["playerName" + i].value,
                color: (elForm.elements as any)["playerColor" + i].value
            });
        }
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/game");
        xhr.onerror = function () {
            alert("Error creating game");
        }
        xhr.send(JSON.stringify({
            name: gameName,
            players: players
        }));
    }
    elForm.appendChild(elCreateGameBtn);
    document.body.appendChild(elForm);
}

window.onload = function () {
    showCreateGameForm();
}
