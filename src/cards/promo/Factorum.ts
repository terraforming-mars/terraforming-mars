import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Game } from "../../Game";
import { IActionCard } from "../ICard";
import { Resources } from "../../Resources";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { CardName } from "../../CardName";
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class Factorum implements IActionCard, CorporationCard {
    public name: CardName = CardName.FACTORUM;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public startingMegaCredits: number = 37;

    public play(player: Player) {
        player.setProduction(Resources.STEEL);
        return undefined;
    }

    public canAct(player: Player): boolean {
        return player.energy === 0 || player.canAfford(3); 
    }

    public action(player: Player, game: Game) {
        const increaseEnergy = new SelectOption(
            "Increase your energy production 1 step",
            "Increase production",
            () => {
              player.setProduction(Resources.ENERGY);
              return undefined;
            }
        );

        const drawBuildingCard = new SelectOption("Spend 3 MC to draw a building card", "Draw card", () => {
            player.megaCredits -= 3;
            player.cardsInHand.push(game.drawCardsByTag(Tags.STEEL, 1)[0]);

            const drawnCard = game.getCardsInHandByTag(player, Tags.STEEL).slice(-1)[0];

            game.log(
                LogMessageType.DEFAULT,
                "${0} drew ${1}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, drawnCard.name)
            );

            return undefined;
        });

        if (player.energy > 0) return drawBuildingCard;
        if (!player.canAfford(3)) return increaseEnergy;

        return new OrOptions(increaseEnergy, drawBuildingCard);
    }
}
