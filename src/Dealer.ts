import { CardName } from "./CardName";
import { ColoniesCardManifest as ColoniesCardManifest } from "./cards/colonies/ColoniesDeck";
import { CorporationCard } from "./cards/corporation/CorporationCard";
import { CardManifest } from "./cards/Deck";
import { IProjectCard } from "./cards/IProjectCard";
import { PreludeCardManifest } from "./cards/prelude/PreludeDeck";
import { PromoCardManifest } from "./cards/promo/PromoDeck";
import { BaseCardManifest, CorpEraCardManifest } from "./cards/StandardDecks";
import { TurmoilCardManifest } from "./cards/turmoil/TurmoilDeck";
import { VenusCardManifest } from "./cards/venusNext/VenusDeck";
import { ILoadable } from "./ILoadable";
import { SerializedDealer } from "./SerializedDealer";

// Corporation Cards
// Project Cards

export interface ICardFactory<T> {
    cardName: CardName;
    factory: new () => T
}

const baseCardManifest = new BaseCardManifest();
const corpEraCardManifest = new CorpEraCardManifest();
const promoCardManifest = new PromoCardManifest();
const venusCardManifest = new VenusCardManifest();
const coloniesCardManifest = new ColoniesCardManifest();
const preludeCardManifest = new PreludeCardManifest();
const turmoilCardManifest = new TurmoilCardManifest();

const decks: Array<CardManifest> = [
    baseCardManifest,
    corpEraCardManifest,
    promoCardManifest,
    venusCardManifest,
    coloniesCardManifest,
    preludeCardManifest,
    turmoilCardManifest
];

// Function to return a card object by its name
// NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
// TODO(kberg): Find the use cases where this is used to find Prelude cards and filter them out to
//              another function, perhaps?
export function getProjectCardByName(cardName: string): IProjectCard | undefined {
    var found : (IProjectCard | undefined);
    decks.forEach(deck => {
        found = deck.findProjectCardByName(cardName);
        if (!found) {
            found = deck.findPreludeCardByName(cardName);
        };
        return found || false;
    });
    return found;
}

// Function to return a corporation card object by its name
export function getCorporationCardByName(cardName: string): CorporationCard | undefined {
    var found : (CorporationCard | undefined);
    decks.forEach(deck => {
        found = deck.findCorporationCardByName(cardName);
        return found || false;
    });
    return found;
}

export class Dealer implements ILoadable<SerializedDealer, Dealer>{
    public deck: Array<IProjectCard> = [];
    public preludeDeck: Array<IProjectCard> = [];
    public discarded: Array<IProjectCard> = [];
    private useCorporateEra: boolean = true;
    private usePreludeExtension: boolean = false;
    private useVenusNextExtension: boolean = false;   
    private useColoniesNextExtension: boolean = false;
    private usePromoCards: boolean = false;
    private useTurmoilExtension: boolean = false;
    constructor(
            useCorporateEra: boolean,
            usePreludeExtension: boolean,
            useVenusNextExtension: boolean,
            useColoniesNextExtension : boolean,
            usePromoCards: boolean,
            useTurmoilExtension: boolean,
            cardsBlackList?: Array<CardName>
        ) {
        this.useCorporateEra = useCorporateEra;
        this.usePreludeExtension = usePreludeExtension;
        this.useVenusNextExtension = useVenusNextExtension;
        this.useColoniesNextExtension = useColoniesNextExtension;
        this.usePromoCards = usePromoCards;
        this.useTurmoilExtension = useTurmoilExtension;

        var deck:Array<IProjectCard> = [];
        var preludeDeck:Array<IProjectCard> = [];
        var projectCardsToRemove:Array<String> = [];

        function addToDeck<T>(deck: Array<T>, cards?: Array<ICardFactory<T>>): void {
            if (cards) {
                deck.push(...cards.map((cf) => new cf.factory()));                   
            }
        }
        function addToDecks(manifest: CardManifest) {
            addToDeck(deck, manifest.projectCards);
            addToDeck(preludeDeck, manifest.preludeCards);
            projectCardsToRemove.push(...manifest.projectCardsToRemove);
        }
        addToDeck(deck, baseCardManifest.projectCards);
        if (this.useCorporateEra) {
            addToDecks(corpEraCardManifest);
        }
        if (this.usePreludeExtension) {
            addToDecks(preludeCardManifest);
        }
        if (this.useVenusNextExtension) {
            addToDecks(venusCardManifest);
        }
        if (this.useColoniesNextExtension) {
            addToDecks(coloniesCardManifest);
        }
        if (this.useTurmoilExtension) {
            addToDecks(turmoilCardManifest);
        }
        if (this.usePromoCards) {
            addToDecks(promoCardManifest);
        }
        if (cardsBlackList) {
            projectCardsToRemove.push(...cardsBlackList);
        }
        var filteredDeck = deck.filter((card) => !projectCardsToRemove.includes(card.name));
        this.deck = this.shuffleCards(filteredDeck);
        if (this.usePreludeExtension) {
            this.preludeDeck = this.shuffleCards(preludeDeck);
        }
    }
    public shuffleCards<T>(cards: Array<T>): Array<T> {
        const deck: Array<T> = [];
        const copy = cards.slice();
        while (copy.length) {
            deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return deck;
    }
    public discard(card: IProjectCard): void {
        this.discarded.push(card);
    }
    public dealCard(isResearchPhase: boolean = false): IProjectCard {
        if (this.deck.length === 0) {
            this.deck = this.shuffleCards(this.discarded);
            this.discarded = [];
        }
        let result: IProjectCard | undefined;
        if (isResearchPhase) {
            result = this.deck.shift();
        } else {
            result = this.deck.pop();
        }

        if (result === undefined) {
            throw "Unexpected empty deck";
        }
        return result;
    }
    // Prelude deck does not need discard and reshuffle mecanisms
    public dealPreludeCard(): IProjectCard {
        const result: IProjectCard | undefined = this.preludeDeck.pop();
        if (result === undefined) {
            throw "Unexpected empty prelude deck";
        }
        // All Prelude cards are expected to subclass IProjectCard
        return result;
    }

    // Function used to rebuild each objects
    public loadFromJSON(d: SerializedDealer): Dealer {
        // Assign each attributes
        let o = Object.assign(this, d);

        // Rebuild deck
        this.deck = d.deck.map((element: IProjectCard)  => {
            return getProjectCardByName(element.name)!;
        });

        // Rebuild prelude deck
        this.preludeDeck = d.preludeDeck.map((element: IProjectCard)  => {
            return getProjectCardByName(element.name)!;
        });

        // Rebuild the discard
        this.discarded = d.discarded.map((element: IProjectCard)  => {
            return getProjectCardByName(element.name)!;
        });
        
        return o;
    }

    public getDeckSize(): number {
        return this.deck.length
    }
}
