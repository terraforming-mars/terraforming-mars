
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { IActionCard, ICard, IResourceCard } from "../ICard";
import { SelectCard } from "../../inputs/SelectCard";
import { CardName } from "../../CardName";
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class Celestic implements IActionCard, CorporationCard, IResourceCard {
    public name: CardName = CardName.CELESTIC;
    public tags: Array<Tags> = [Tags.VENUS];
    public startingMegaCredits: number = 42;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    private static readonly floaterCards: Set<CardName> = new Set<CardName>([
        CardName.AEROSPORT_TOURNAMENT,
        CardName.AIR_SCRAPPING_EXPEDITION,
        CardName.AIR_RAID,
        CardName.AIRLINERS,
        CardName.ATMOSCOOP,
        CardName.FLOATER_LEASING,
        CardName.FLOATER_PROTOTYPES,
        CardName.FLOATER_TECHNOLOGY,
        CardName.HYDROGEN_TO_VENUS,
        CardName.NITROGEN_FROM_TITAN,
        CardName.STRATOSPHERIC_BIRDS
    ]);

    public initialAction(player: Player, game: Game) {
        const requiredCardsCount = 2;
        if (game.hasCardsWithResource(ResourceType.FLOATER, requiredCardsCount)) {
            let drawnCount = 0;
            const drawnCards = [];
            while (drawnCount < requiredCardsCount) {
                let card = game.dealer.dealCard();
                if (Celestic.floaterCards.has(card.name) || card.resourceType === ResourceType.FLOATER) {
                    player.cardsInHand.push(card);
                    drawnCards.push(card);
                    drawnCount++;
                } else {
                    game.dealer.discard(card);
                }
            }

            game.log(
                LogMessageType.DEFAULT,
                "${0} drew ${1} and ${2}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[0].name),
                new LogMessageData(LogMessageDataType.CARD, drawnCards[1].name)
            );
        }
        
        return undefined;
    }

    public play() {
        return undefined;
    }

    public canAct(): boolean {
        return true; 
    }

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 3);
    }

    public action(player: Player) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        if (floaterCards.length === 1) {
            this.resourceCount++;
            return undefined;
        }

        return new SelectCard(
            "Select card to add 1 floater",
            floaterCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 1);
            return undefined;
            }
        );
    }
}
