
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class Shuttles implements IProjectCard {
    public cost = 10;
    public tags = [Tags.SPACE];
    public cardType = CardType.ACTIVE;
    public name = CardName.SHUTTLES;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 5 - player.getRequirementsBonus(game) && player.getProduction(Resources.ENERGY) >= 1;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            return 2;
        }
        return 0;
    }
    public play(player: Player) {
        player.addProduction(Resources.ENERGY,-1);
        player.addProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }    
}
