import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Sponsors implements IProjectCard {
    public cost = 6;
    public tags = [Tags.EARTH];
    public name = CardName.SPONSORS;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '068',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(2));
      }),
      description: 'Increase your MC production 2 steps.',
    };
}
