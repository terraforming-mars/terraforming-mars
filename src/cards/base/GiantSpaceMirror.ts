import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class GiantSpaceMirror implements IProjectCard {
    public cost = 17;
    public tags = [Tags.ENERGY, Tags.SPACE];
    public name = CardName.GIANT_SPACE_MIRROR;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 3);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '083',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.energy(3))),
      description: 'Increase your energy production 3 steps.',
    };
}
