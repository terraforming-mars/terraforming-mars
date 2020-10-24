import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";

export class GreatEscarpmentConsortium implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.GREAT_ESCARPMENT_CONSORTIUM;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.STEEL) >= 1;
    }
    public play(player: Player, game: Game) {
        game.defer(new DecreaseAnyProduction(player, game, Resources.STEEL, 1));
        player.addProduction(Resources.STEEL);
        return undefined;
    }
}
