
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class SolarPower implements IProjectCard {
    public cost = 11;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.SOLAR_POWER;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
