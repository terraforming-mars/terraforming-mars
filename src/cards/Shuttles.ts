
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Shuttles implements IProjectCard {
    public cost: number = 10;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Shuttles";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 5 - player.getRequirementsBonus(game) && player.energyProduction >= 1;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            return 2;
        }
        return 0;
    }
    public play(player: Player) {
        player.energyProduction -= 1;
        player.megaCreditProduction += 2;
        player.victoryPoints++;
        return undefined;
    }    
}
