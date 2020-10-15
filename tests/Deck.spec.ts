import { Deck } from "../src/Deck";
import { Decks } from "../src/Deck";
import { IProjectCard } from "../src/cards/IProjectCard";
import { ICardFactory } from "../src/cards/ICardFactory";
import { CardName } from "../src/CardName";
import { expect } from "chai";
import { AcquiredCompany } from "../src/cards/AcquiredCompany";
import { BannedDelegate } from "../src/cards/turmoil/BannedDelegate";
import { CallistoPenalMines } from "../src/cards/CallistoPenalMines";
import { Decomposers } from "../src/cards/Decomposers";
import { EcologicalZone } from "../src/cards/EcologicalZone";
import { FuelFactory } from "../src/cards/FuelFactory";

describe("Deck", function () {
    const cards: Array<ICardFactory<IProjectCard>> = [
        { cardName: CardName.ACQUIRED_COMPANY, factory: AcquiredCompany },
        { cardName: CardName.BANNED_DELEGATE, factory: BannedDelegate },
        { cardName: CardName.CALLISTO_PENAL_MINES, factory: CallistoPenalMines },
    ];
    const deck: Deck<IProjectCard> = new Deck(cards);

    const secondCards: Array<ICardFactory<IProjectCard>> = [
        { cardName: CardName.DECOMPOSERS, factory: Decomposers },
        { cardName: CardName.ECOLOGICAL_ZONE, factory: EcologicalZone },
        { cardName: CardName.FUEL_FACTORY, factory: FuelFactory },
    ];
    const secondDeck: Deck<IProjectCard> = new Deck(secondCards);

    it("findCardByName: success", function() {
        expect(deck.findByCardName("Acquired Company")).is.not.undefined;        
    });
    it("findCardByName: failure", function() {
        expect(deck.findByCardName("Ecological Zone")).is.undefined
    })
    it("shuffle", function() {
        expect(deck.shuffled().cards).to.have.members(cards);        
    })
    it("Decks.findCardByName: success", function() {
        expect(Decks.findByName([deck, secondDeck], "Ecological Zone")).is.not.undefined;
    })
    it("Decks.findCardByName: failure", function() {
        expect(Decks.findByName([deck, secondDeck], "Eggylogical Zone")).is.undefined;
       
    })
    it("Decks.allCardNames", function() {
        expect(Decks.allCardNames([deck, secondDeck])).to.have.members([
          "Acquired Company",
          "Banned Delegate",
          "Callisto Penal Mines",
          "Decomposers",
          "Ecological Zone",
          "Fuel Factory",
        ]);
       
    })
});