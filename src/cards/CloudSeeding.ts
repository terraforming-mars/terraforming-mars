import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";

export class CloudSeeding implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.CLOUD_SEEDING;
    public cardType: CardType = CardType.AUTOMATED;
    
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.MEGACREDITS) > -5 &&
        game.board.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game) &&
        game.someoneHasResourceProduction(Resources.HEAT,1);
    }

    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.HEAT, 1));
      player.addProduction(Resources.MEGACREDITS,-1);
      player.addProduction(Resources.PLANTS,2);
      return undefined;
    }
}
