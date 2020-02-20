import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';

export class IceMoonColony implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = CardName.ICE_MOON_COLONY;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.addColonyInterrupt(player, false, "Select colony for Ice Moon Colony");
      game.addOceanInterrupt(player, "Select ocean for Ice Moon Colony");  
      return undefined;
    }
}