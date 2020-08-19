import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CorporationCard } from "../corporation/CorporationCard";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { ResourceType } from "../../ResourceType";
import { CardName } from "../../CardName";
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";
import { ICard } from "../ICard";

export class Splice implements CorporationCard {
    public name: CardName = CardName.SPLICE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public startingMegaCredits: number = 48; // 44 + 4 as card resolution when played

    public initialAction(player: Player, game: Game) { 
        player.cardsInHand.push(game.drawCardsByTag(Tags.MICROBES, 1)[0]);
        
        const drawnCards = game.getCardsInHandByTag(player, Tags.MICROBES).slice(-1);

        game.log(
            LogMessageType.DEFAULT,
            "${0} drew ${1}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.CARD, drawnCards[0].name)
        );
        
        return undefined;
    }

    public onCardPlayed(player: Player, game: Game, card: IProjectCard | CorporationCard) {
        if (card.tags.indexOf(Tags.MICROBES) === -1) {return undefined;}
        const gainPerMicrobe = 2;
        const microbeTagsCount = card.tags.filter(tag => tag === Tags.MICROBES).length;
        const megacreditsGain = microbeTagsCount * gainPerMicrobe;

        const addResource = new SelectOption("Add a microbe resource to this card", "Add microbe", () => {
            player.addResourceTo(card);
            return undefined;
        });

        const getMegacredits = new SelectOption(`Gain ${megacreditsGain} MC`, "Gain MC", () => {
            player.megaCredits += megacreditsGain;
            return undefined;
        });

        // Splice owner get 2MC per microbe tag
        game.getCardPlayer(this.name).megaCredits += megacreditsGain;

        // Card player choose between 2 MC and a microbe on card, if possible
        if (card.resourceType !== undefined && card.resourceType === ResourceType.MICROBE) {
            return new OrOptions(addResource, getMegacredits);
        } else {
            player.megaCredits += megacreditsGain;
            return undefined;
        }    
    }

    public onCorpCardPlayed(player: Player, game: Game, card: CorporationCard): void {
        this.onCardPlayed(player,game,card as ICard as IProjectCard);
    }

    public play() {
        return undefined;
    }
}
