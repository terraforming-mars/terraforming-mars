
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { CardName } from '../CardName';

export class BribedCommitte implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.BRIBED_COMMITTEE;

    public play(player: Player) {
      player.terraformRating += 2;
      return undefined;
    }

    public getVictoryPoints() {
      return -2;
    }
}
