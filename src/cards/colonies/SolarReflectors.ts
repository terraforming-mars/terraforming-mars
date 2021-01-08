import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SolarReflectors implements IProjectCard {
    public cost = 23;
    public tags = [Tags.SPACE];
    public name = CardName.SOLAR_REFLECTORS;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.HEAT, 5);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C38',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.heat(5).digit);
      }),
      description: 'Increase your heat production 5 steps.',
    }
}
