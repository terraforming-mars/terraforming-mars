
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class GreatEscarpmentConsortium implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [];
    public name: string = CardName.GREAT_ESCARPMENT_CONSORTIUM;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        if (game.getPlayers().length > 1 
          && game.getPlayers().filter(p => p.id !== player.id && p.getProduction(Resources.STEEL) > 0).length === 0 ) {
              return false; //No other player to reduce resource from
        }
        return player.getProduction(Resources.STEEL) > 0;
    }
    public play(player: Player, game: Game) {
        game.addResourceProductionDecreaseInterrupt(player, Resources.STEEL, 1);
        player.setProduction(Resources.STEEL);
        return undefined;
    }
}