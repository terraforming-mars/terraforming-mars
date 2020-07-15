import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CorporationCard } from '../corporation/CorporationCard';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { ResourceType } from "../../ResourceType";
import { CardName } from '../../CardName';
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

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.MICROBES) === -1) {return undefined;}

        const addResource = new SelectOption("Add a microbe resource to this card", () => {
            player.addResourceTo(card);
            return undefined;
        });

        const getMegacredits = new SelectOption("Get 2 MC", () => {
            player.megaCredits += 2;
            return undefined;
        });

        // Splice owner get 2MC
        game.getCardPlayer(this.name).megaCredits += 2;

        // Card player choose between 2 MC and a microbe on card, if possible
        if (card.resourceType !== undefined && card.resourceType === ResourceType.MICROBE) {
            return new OrOptions(addResource, getMegacredits);
        } else {
            player.megaCredits += 2;
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
