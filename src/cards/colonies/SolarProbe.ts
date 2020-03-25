import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';

export class SolarProbe implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SPACE, Tags.SCIENCE];
    public name: CardName = CardName.SOLAR_PROBE;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      let cardsToDraw = Math.floor((player.getTagCount(Tags.SCIENCE) + 1) / 3);
      for (let i = 0; i < cardsToDraw; i++) {
        player.cardsInHand.push(game.dealer.dealCard());
      }
      return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
