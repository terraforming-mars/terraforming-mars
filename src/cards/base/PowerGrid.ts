import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PowerGrid implements IProjectCard {
    public cost = 18;
    public tags = [Tags.ENERGY];
    public name = CardName.POWER_GRID;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 1 + player.getTagCount(Tags.ENERGY));
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '102',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1).slash().energy(1).played);
      }),
      description: 'Increase your Energy production step for each Power tag you have, including this.',
    }
}
