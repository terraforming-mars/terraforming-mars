import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Mine implements IProjectCard {
    public cost = 4;
    public tags = [Tags.BUILDING];
    public name = CardName.MINE;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      return undefined;
    }
    public metadata: CardMetadata = {
      description: 'Increase your steel production 1 step.',
      cardNumber: '056',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.steel(1))),
    };
}
