
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class LightningHarvest implements IProjectCard {
    public cost = 8;
    public tags = [Tags.ENERGY];
    public name = CardName.LIGHTNING_HARVEST;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 3;
    }
    public play(player: Player, _game: Game) {
      if (player.getTagCount(Tags.SCIENCE) < 3) {
        throw 'Requires 3 science tags';
      }
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.MEGACREDITS);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
