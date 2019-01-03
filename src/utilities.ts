
import { CorporationCard } from "./CorporationCard";

const generatedIds: {[x: string]: boolean } = {};

export function shuffle<T>(arr: Array<T>): Array<T> {
    var result = [];
    while (arr.length > 0) {
        result.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    return result;
}

export function generateUUID(): string {
    var result = "";
    for (var i = 0; i < 16; i++) {
        result += new Number(Math.floor(Math.random() * 16)).toString(16);
    }
    if (generatedIds[result]) {
        return generateUUID();
    }
    generatedIds[result] = true;
    return result;
}

export function findBeginnerCard(corporationCards: Array<CorporationCard>): CorporationCard {
    for (var i = 0; i < corporationCards.length; i++) {
        if (corporationCards[i].name === "Beginner Corporation") {
            return corporationCards.splice(i, 1)[0];
        }
    }
    throw "Unable to find beginner card";
}

