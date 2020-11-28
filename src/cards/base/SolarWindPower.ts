
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class SolarWindPower implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE, Tags.SPACE, Tags.ENERGY];
    public name = CardName.SOLAR_WIND_POWER;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      player.titanium += 2;
      return undefined;
    }
}
