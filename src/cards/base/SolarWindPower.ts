import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

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

    public metadata: CardMetadata = {
      cardNumber: '077',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1)).br.titanium(2);
      }),
      description: 'Increase your energy production 1 step and gain 2 titanium.',
    }
}
