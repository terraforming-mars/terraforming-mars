
import { SpaceType } from "./src/SpaceType";

export function showCreateGameForm(): void {
    const maxPlayers: number = 5;
    const elForm = document.createElement("form");
    elForm.id = "create-game";
    const elCreateGameBtn = document.createElement("input");
    const elHeader = document.createElement("h1");
    elHeader.innerHTML = "Teraforming Mars";
    const elSubHeader = document.createElement("h2");
    elSubHeader.innerHTML = "Create New Game";
    elForm.appendChild(elHeader);
    elForm.appendChild(elSubHeader);
    elCreateGameBtn.type = "button";
    elCreateGameBtn.value = "Create Game";
    for (let i: number = 0; i < maxPlayers; i++) {
        const elPlayerFieldset = document.createElement("fieldset");
        const elLabelPlayer = document.createElement("label");
        elLabelPlayer.innerHTML = "Player " + (i + 1) + " Name:";
        elLabelPlayer.setAttribute("for", "playerName" + i);
        const elInputPlayer = document.createElement("input");
        elInputPlayer.id = "playerName" + i;
        elInputPlayer.name = "playerName" + i;
        elInputPlayer.type = "text";
        elInputPlayer.value = "Player" + Math.floor(Math.random() * 12345151);
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
        const elBeginnerPlayer = document.createElement("input");
        elBeginnerPlayer.type = "checkbox";
        elBeginnerPlayer.name = "playerBeginner" + i;
        elBeginnerPlayer.id = "playerBeginner" + i;
        const elBeginnerLabel = document.createElement("label");
        elBeginnerLabel.innerHTML = "Is beginner?";
        elBeginnerLabel.setAttribute("for", "playerBeginner" + i);
        const elFirstLabel = document.createElement("label");
        elFirstLabel.innerHTML = "Goes first?";
        elFirstLabel.setAttribute("for", "firstPlayer" + i);
        const elFirstPlayer = document.createElement("input");
        elFirstPlayer.type = "radio";
        elFirstPlayer.value = "" + i;
        elFirstPlayer.name = "firstPlayer";
        elFirstPlayer.id = "firstPlayer" + i;
        elFirstPlayer.checked = i === 0;
        elPlayerFieldset.appendChild(elLabelPlayer);
        elPlayerFieldset.appendChild(elInputPlayer);
        elPlayerFieldset.appendChild(elColorPlayer);
        elPlayerFieldset.appendChild(elFirstLabel);
        elPlayerFieldset.appendChild(elFirstPlayer);
        elPlayerFieldset.appendChild(elBeginnerLabel);
        elPlayerFieldset.appendChild(elBeginnerPlayer);
        elForm.appendChild(elPlayerFieldset);
    }
    elCreateGameBtn.onclick = function () {
        const players: Array<{[x: string]: string | boolean}> = [];
        for (let i: number = 0; i < maxPlayers; i++) {
            players.push({
                name: (elForm.elements as any)["playerName" + i].value,
                first: parseInt((elForm.elements as any)["firstPlayer"].value) === i,
                beginner: (elForm.elements as any)["playerBeginner" + i].checked,
                color: (elForm.elements as any)["playerColor" + i].value
            });
        }
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/game");
        xhr.onerror = function () {
            alert("Error creating game");
        }
        xhr.onload = function () {
            if (this.status === 200) {
                window.history.replaceState(this.response, "Teraforming Mars - Game", "/game?id=" + this.response.id);
                showGameHome(this.response);
            } else {
                alert("Unexpected server response");
            }
        };
        xhr.responseType = "json";
        xhr.send(JSON.stringify({
            players: players
        }));
    }
    elForm.appendChild(elCreateGameBtn);
    document.body.appendChild(elForm);
}

export function showGameHome(game: any): void {
    document.body.innerHTML = "";
    const elHeader = document.createElement("h1");
    elHeader.innerHTML = "Teraforming Mars - Game Home";
    const elInstructions = document.createElement("p");
    elInstructions.innerHTML = "Send players their links below. As game administrator pick your link to use.";
    const elPlayerList = document.createElement("ul");
    document.body.appendChild(elHeader);
    document.body.appendChild(elInstructions);
    document.body.appendChild(elPlayerList);
    game.players.forEach(function (player: any) {
        const elPlayerItem = document.createElement("li");
        const elPlayerLink = document.createElement("a");
        elPlayerLink.href = "/player?id=" + player.id;
        elPlayerItem.appendChild(elPlayerLink);
        elPlayerList.appendChild(elPlayerItem);
        elPlayerLink.innerHTML = player.name + " - " + player.color;
    });
}

export function showPlayerHome(player: any): void {
    document.body.innerHTML = "";
    const elHeader = document.createElement("h1");
    elHeader.innerHTML = "Teraforming Mars - Player Home - " + player.name;
    const elPlayedCardsHeader = document.createElement("h2");
    elPlayedCardsHeader.innerHTML = "Played Cards";
    const elCardsInHand = document.createElement("h2");
    elCardsInHand.innerHTML = "Cards In Hand";
    document.body.appendChild(elHeader);
    document.body.appendChild(elPlayedCardsHeader);
    document.body.appendChild(elCardsInHand);
    const elResourceCount = document.createElement("div");
    elResourceCount.innerHTML = "<h2>Resources</h2>Mega Credits: " + player.megaCredits + "<br/>Mega Credit Production: " + player.megaCreditProduction;
    elResourceCount.innerHTML += "<br/>Steel: " + player.steel + "<br/>Steel Production: " + player.steelProduction;
    elResourceCount.innerHTML += "<br/>Titanium: " + player.titanium + "<br/>Titanium Production: " + player.titaniumProduction;
    elResourceCount.innerHTML += "<br/>Energy: " + player.energy + "<br/>Energy Production: " + player.energyProduction;
    elResourceCount.innerHTML += "<br/>Heat: " + player.heat + "<br/>Heat Production: " + player.heatProduction;
    document.body.appendChild(elResourceCount);
    const elBoardHeader = document.createElement("h2");
    elBoardHeader.innerHTML = "Board";
    const elColonies = document.createElement("h3");
    elColonies.innerHTML = "Colonies";
    document.body.appendChild(elBoardHeader);
    document.body.appendChild(elColonies);
    player.spaces.filter((space: any) => {
        return space.spaceType === SpaceType.COLONY
    }).forEach((colony: any) => {
        const elColony = document.createElement("div");
        elColony.innerHTML = colony.id;
        document.body.appendChild(elColony);
    });
    player.spaces.filter((space: any) => space.spaceType !== "colony")
        .forEach((space: any) => {
            console.log(space.x + ":" + space.y);
        });

    if (player.waitingFor) {

    }
    console.log(player);

}
