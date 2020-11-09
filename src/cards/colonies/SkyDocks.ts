import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';

export class SkyDocks implements IProjectCard {
    public cost = 18;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.SKY_DOCKS;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.EARTH) >= 2;
    }

    public play(player: Player) {
      player.increaseFleetSize();
      return undefined;
    }

    public getCardDiscount() {
      return 1;
    }

    public getVictoryPoints() {
      return 2;
    }
}
