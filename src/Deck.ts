import { ICardFactory } from "./cards/ICardFactory";

export class Deck<T> {
    cards: Array<ICardFactory<T>>;

    constructor(cards: Array<ICardFactory<T>>) {
        this.cards = cards;
    }

    public findByCardName(name: string): ICardFactory<T> | undefined {
        return this.cards.find((cf) => cf.cardName === name);
    }

    public shuffled(): Deck<T> {
        const shuffled: Array<ICardFactory<T>> = [];
        const copy = this.cards.slice();
        while (copy.length) {
            shuffled.push(
                copy.splice(Math.floor(Math.random() * copy.length), 1)[0]
            );
        }
        return new Deck(shuffled);
    }
}

export class Decks {
    public static findByName<T>(decks: Array<Deck<T>>, cardName: string): T | undefined {
        let found: T | undefined;

        decks.forEach((deck) => {
            // Short circuit
            if (found) {
                return;
            }
            const cf = deck.findByCardName(cardName);
            if (cf) {
                found = new cf.factory();
            }
        });
        return found;
    }
}
