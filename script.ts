
import { PlayerInputTypes } from "./src/PlayerInputTypes";
import { SpaceBonus } from "./src/SpaceBonus";
import { SpaceName } from "./src/SpaceName";
import { SpaceType } from "./src/SpaceType";
import { HowToPay } from "./src/inputs/HowToPay";

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
            if ((elForm.elements as any)["playerName" + i].value !== "") {
                players.push({
                    name: (elForm.elements as any)["playerName" + i].value,
                    first: parseInt((elForm.elements as any)["firstPlayer"].value) === i,
                    beginner: (elForm.elements as any)["playerBeginner" + i].checked,
                    color: (elForm.elements as any)["playerColor" + i].value
                });
            }
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

function getSelectSpace(playerInput: any, cb: (out: Array<Array<string>>) => void): Element {
    const elResult = document.createElement("div");
    const elMessage = document.createElement("div");
    elMessage.innerHTML = playerInput.message;
    const elTitle = document.createElement("div");
    elTitle.innerHTML = playerInput.title;
    elResult.appendChild(elTitle);
    elResult.appendChild(elMessage);
    const elButton = document.createElement("input");
    elButton.type = "button";
    elButton.onclick = function () {
        alert("Need to implement this");
        cb([["GANYMEDE_COLONY"]]);
    };
    elButton.value = "Select";
    elResult.appendChild(elButton);
    return elResult;
}

function getSelectOption(playerInput: any, cb: (out: Array<Array<string>>) => void): Element {
    const elResult = document.createElement("div");
    const elMessage = document.createElement("div");
    elMessage.innerHTML = playerInput.message;
    const elTitle = document.createElement("div");
    elTitle.innerHTML = playerInput.title;
    elResult.appendChild(elTitle);
    elResult.appendChild(elMessage);
    const elButton = document.createElement("input");
    elButton.type = "button";
    elButton.onclick = function () {
        cb([["1"]]);
    };
    elButton.value = "Select";
    elResult.appendChild(elButton);
    return elResult;
}

function getSelectHowToPay(playerInput: any, cb: (out: Array<Array<string>>) => void): Element {
    const elResult = document.createElement("div");
    const elTitle = document.createElement("div");
    elTitle.innerHTML = playerInput.title;
    elResult.appendChild(elTitle);
    let elSteelValue: HTMLInputElement | undefined = undefined;
    let elTitaniumValue: HTMLInputElement | undefined = undefined;
    let elHeatValue: HTMLInputElement | undefined = undefined;
    if (playerInput.canUseSteel) {
        const elSteelLabel = document.createElement("label");
        elSteelLabel.innerHTML = "Steel: ";
        elResult.appendChild(elSteelLabel);
        elSteelValue = document.createElement("input");
        elSteelValue.type = "text";
        elSteelValue.value = "0";
        elResult.appendChild(elSteelValue);
    }
    if (playerInput.canUseTitanium) {
        const elTitaniumLabel = document.createElement("label");
        elTitaniumLabel.innerHTML = "Titanium: ";
        elResult.appendChild(elTitaniumLabel);
        elTitaniumValue = document.createElement("input");
        elTitaniumValue.type = "text";
        elTitaniumValue.value = "0";
        elResult.appendChild(elTitaniumValue);
    }
    if (playerInput.canUseHeat) {
        const elHeatLabel = document.createElement("label");
        elHeatLabel.innerHTML = "Heat: ";
        elResult.appendChild(elHeatLabel);
        elHeatValue = document.createElement("input");
        elHeatValue.type = "text";
        elHeatValue.value = "0";
        elResult.appendChild(elHeatValue);
    }
    const elMegaLabel = document.createElement("label");
    elMegaLabel.innerHTML = "Mega Credit: ";
    elResult.appendChild(elMegaLabel);
    const elMegaValue = document.createElement("input");
    elMegaValue.type = "text";
    elMegaValue.value = "0";
    elResult.appendChild(elMegaValue);
    const elSelect = document.createElement("input");
    elSelect.type = "button";
    elSelect.onclick = function () {
        var htp: HowToPay = {
            steel: 0,
            titanium: 0,
            megaCredits: 0
        };
        if (elSteelValue !== undefined) {
            htp.steel = parseInt(elSteelValue.value);
        }
        if (elTitaniumValue !== undefined) {
            htp.titanium = parseInt(elTitaniumValue.value);
        }
        if (elHeatValue !== undefined) {
            htp.heat = parseInt(elHeatValue.value);
        }
        if (elMegaValue !== undefined) {
            htp.megaCredits = parseInt(elMegaValue.value);
        }
        cb([[JSON.stringify(htp)]]);
    };
    elResult.appendChild(elSelect);
    return elResult;
}

function getSelectCard(playerInput: any, cb: (out: Array<Array<string>>) => void): Element {
    const elResult = document.createElement("div");
    const elTitle = document.createElement("div");
    elTitle.innerHTML = playerInput.title;
    elResult.appendChild(elTitle);
    const checkboxes: Array<HTMLInputElement> = [];
    playerInput.cards.forEach((card: any) => {
        const elCard = document.createElement("div");
        const elSelect = document.createElement("input");
        elSelect.type = "checkbox";     
        elCard.innerHTML = card.name;
        elResult.appendChild(elSelect);
        elResult.appendChild(elCard);
        checkboxes.push(elSelect);
    });
    const elSubmitChoice = document.createElement("input");
    elSubmitChoice.type = "button";
    elSubmitChoice.value = "Save";
    elSubmitChoice.onclick = function () {
        const checked = checkboxes.filter((box) => box.checked);
        if (checked.length < playerInput.minCardsToSelect) {
            alert("You must select at least " + playerInput.minCardsToSelect + " cards");
        } else if (checked.length > playerInput.maxCardsToSelect) {
            alert("You must select at most " + playerInput.maxCardsToSelect + " cards");
        } else {
            var res: Array<string> = [];
            for (let i = 0; i < playerInput.cards.length; i++) {
                if (checkboxes[i].checked) {
                    res.push(playerInput.cards[i].name);
                }
            }
            cb([res]);
        }
    }
    elResult.appendChild(elSubmitChoice);
    return elResult;
}

function getPlayerInput(playerInput: any, cb: (out: Array<Array<string>>) => void): Element {
    if (playerInput.inputType === PlayerInputTypes.AND_OPTIONS) {
        const elResult = document.createElement("div");
        const elMessage = document.createElement("div");
        elMessage.innerHTML = playerInput.message;
        elResult.appendChild(elMessage);
        const results: Array<Array<string>> = [];
        let responded: number = 0;
        playerInput.options.forEach((option: any, idx: number) => {
            elResult.appendChild(getPlayerInput(option, (out: Array<Array<string>>) => {
                results[idx] = out[0];
                responded++; 
                if (responded === playerInput.options.length) {
                    cb(results);
                }
            }));
        });
        return elResult;
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_CARD) {
        return getSelectCard(playerInput, cb);
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_HOW_TO_PAY) {
        return getSelectHowToPay(playerInput, cb);
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_OPTION) {
        return getSelectOption(playerInput, cb);
    } else if (playerInput.inputType === PlayerInputTypes.SELECT_SPACE) {
        return getSelectSpace(playerInput, cb);
    } else if (playerInput.inputType === PlayerInputTypes.OR_OPTIONS) {
        const elResult = document.createElement("div");
        const elTitle = document.createElement("div");
        const elOptions: Array<HTMLDivElement> = [];
        elTitle.innerHTML = playerInput.title;
        elResult.appendChild(elTitle);
        playerInput.options.forEach((option: any, idx: number) => {
            const elOptionContainer = document.createElement("div");
            const elRadio = document.createElement("input");
            elRadio.type = "radio";
            elRadio.name = "or_option";
            elRadio.value = String(idx);
            elOptionContainer.appendChild(elRadio);
            elRadio.onchange = function () {
                elOptions.forEach((o) => {
                    o.style.display = "none";
                });
                if (elRadio.checked) {
                    (elOption as HTMLDivElement).style.display = "";
                } else {
                    (elOption as HTMLDivElement).style.display = "none";
                }
            }
            const elMessage = document.createElement("span");
            elMessage.innerHTML = option.message;
            elOptionContainer.appendChild(elMessage);
            const elOption = elOptionContainer.appendChild(getPlayerInput(option, (out: Array<Array<string>>) => {
                out.unshift([String(idx)]);
                cb(out);
            }));
            elOptions.push(elOption as HTMLDivElement);
            (elOption as HTMLDivElement).style.display = "none";
            elResult.appendChild(elOptionContainer);
        });
        return elResult;
    } else {
        throw "Unsupported input type" + playerInput.inputType;
    }
}

export function showPlayerHome(player: any): void {
    document.body.innerHTML = "";
    const elHeader = document.createElement("h1");
    elHeader.innerHTML = "Teraforming Mars - Player Home - " + player.name;
    document.body.appendChild(elHeader);
    const elCorporationCardHeader = document.createElement("h2");
    elCorporationCardHeader.innerHTML = "Corporation Card";
    document.body.appendChild(elCorporationCardHeader);
    if (player.corporationCard) {
        const elCard = document.createElement("span");
        elCard.innerHTML = player.corporationCard;
        document.body.appendChild(elCard);
    } else {
        const elCard = document.createElement("span");
        elCard.innerHTML = "NONE";
        document.body.appendChild(elCard);
    }
    const elPlayedCardsHeader = document.createElement("h2");
    elPlayedCardsHeader.innerHTML = "Played Cards";
    const elCardsInHandHeader = document.createElement("h2");
    elCardsInHandHeader.innerHTML = "Cards In Hand";
    document.body.appendChild(elPlayedCardsHeader);
    const elPlayedCards = document.createElement("div");
    if (player.playedCards.length) {
        player.playedCards.forEach((cardName: string) => {
            const elCard = document.createElement("span");
            elCard.innerHTML = cardName;
            elPlayedCards.appendChild(elCard);
        });
    } else {
        elPlayedCards.innerHTML = "NONE";
    }
    document.body.appendChild(elPlayedCards);
    document.body.appendChild(elCardsInHandHeader);
    const elCardsInHand = document.createElement("div");
    if (player.cardsInHand.length) {
        player.cardsInHand.forEach((cardName: string) => {
            const elCard = document.createElement("span");
            elCard.innerHTML = cardName;
            elCardsInHand.appendChild(elCard);
        });
    } else {
        elCardsInHand.innerHTML = "NONE";
    }
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
    document.body.appendChild(elBoardHeader);
    const boardSpaces = player.spaces.filter((space: any) => space.x >= 0 && space.y >= 0);
    boardSpaces.sort((s1: any, s2: any) => {
        if (s1.y === s2.y) {
            return s1.x - s2.x;
        }
        return s1.y - s2.y;
    });
    const elBoard = document.createElement("div");
    elBoard.className = "board";
    let lastY: number | undefined = undefined;
    let elRow: HTMLDivElement | undefined = undefined;
    const elGanymede = document.createElement("div");
    elGanymede.style.position = "absolute";
    elGanymede.style.left = "0px";
    elGanymede.style.top = "10px";
    elGanymede.innerHTML = "<span class='tile'><span class='colony'>&#x2B22</span><span class='name'>GANYMEDE_COLONY</span></span>";
    elBoard.appendChild(elGanymede);
    while (boardSpaces.length) {
        const thisSpace = boardSpaces.shift();
        if (lastY === undefined || thisSpace.y !== lastY) {
            if (elRow !== undefined) {
                elBoard.appendChild(elRow);
            }
            elRow = document.createElement("div");
            elRow.className = "row";
            elRow.style.paddingLeft = (25 * thisSpace.x) + "px";
        }
        const elCell = document.createElement("div");
        elCell.className = "tile";
        const elSpace = document.createElement("span");
        if (thisSpace.spaceType === SpaceType.LAND) {
            elSpace.className = "land";
        } else if (thisSpace.spaceType === SpaceType.OCEAN) {
            elSpace.className = "aquifer";
        }
        elSpace.innerHTML = "&#x2B22";
        elCell.appendChild(elSpace);
        thisSpace.bonus.forEach((bonus: any) => {
            const elBonus = document.createElement("span");
            elBonus.className = "bonus";
            if (bonus === SpaceBonus.TITANIUM) {
                elBonus.innerHTML = "&#x272A";
            } else if (bonus === SpaceBonus.STEEL) {
                elBonus.innerHTML = "&#x2692";
                elBonus.className += " steel";
            } else if (bonus === SpaceBonus.PLANT) {
                elBonus.innerHTML = "&#x1F343";
                elBonus.className += " plane";
            } else if (bonus === SpaceBonus.DRAW_CARD) {
                elBonus.innerHTML = "&#x1F0A0";
            }
            elCell.appendChild(elBonus);
        });
        if (thisSpace.id === SpaceName.ARSIA_MONS ||
            thisSpace.id === SpaceName.ASCRAEUS_MONS ||
            thisSpace.id === SpaceName.NOCTIS_CITY ||
            thisSpace.id === SpaceName.PAVONIS_MONS ||
            thisSpace.id === SpaceName.THARSIS_THOLUS) {
            const elName = document.createElement("span");
            elName.className = "name";
            elName.innerHTML = thisSpace.id;
            elCell.appendChild(elName);
        }
        if (elRow !== undefined) {
            elRow.appendChild(elCell);
        }
        lastY = thisSpace.y;
    }
    if (elRow !== undefined) {
        elBoard.appendChild(elRow);
    }
    const elPhobos = document.createElement("div");
    elPhobos.style.position = "absolute";
    elPhobos.style.left = "0px";
    elPhobos.style.top = "360px";
    elPhobos.innerHTML = "<span class='tile'><span class='colony'>&#x2B22</span><span class='name'>PHOBOS_SPACE_HAVEN</span></span>";
    elBoard.appendChild(elPhobos);
    document.body.appendChild(elBoard);
    const elWaitingFor = document.createElement("div");
    document.body.appendChild(elWaitingFor);
    if (player.waitingFor) {
        elWaitingFor.appendChild(getPlayerInput(player.waitingFor, (out) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/player/input?id=" + player.id);
            xhr.responseType = "json";
            xhr.onload = function () {
                if (this.status === 200) {
                    showPlayerHome(xhr.response);
                } else {
                    alert("Error sending input");
                }
            }
            xhr.send(JSON.stringify(out));
        }));
    }

    console.log(player);

}
