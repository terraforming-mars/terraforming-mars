import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";

export class DesperateMeasures implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.EVENT];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.DESPERATE_MEASURES;

    public getVictoryPoints() {
      return -2;
    }

    public play(_player: Player, _game: Game) {
      // TODO(kberg): getting this card to work requires
      // more than the game currently supports.
      return undefined;
    }
}
