import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class AsteroidMining implements IProjectCard {
    public cost: number = 30;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ASTEROID_MINING;

    public play(player: Player) {
      player.addProduction(Resources.TITANIUM,2);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
