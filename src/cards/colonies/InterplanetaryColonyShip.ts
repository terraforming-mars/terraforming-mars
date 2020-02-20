import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';

export class InterplanetaryColonyShip implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public name: string = CardName.INTERPLANETARY_COLONY_SHIP;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      game.addColonyInterrupt(player, false, "Select colony for Interplanetary Colony Ship");
      return undefined;
    }
}