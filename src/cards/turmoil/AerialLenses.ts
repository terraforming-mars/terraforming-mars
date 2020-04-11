import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';


export class AerialLenses implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.AERIAL_LENSES;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.KELVINISTS);
        }
        return false;
    }

    public play(player: Player, game: Game) {
      player.setProduction(Resources.HEAT,2);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 2);
      return undefined;
    }

    public getVictoryPoints() {
        return -1;
      }
}