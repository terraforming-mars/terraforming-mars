import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MiningOperations extends PreludeCard implements IProjectCard {
    public tags = [Tags.BUILDING];
    public name = CardName.MINING_OPERATIONS;
    public play(player: Player) {
      player.addProduction(Resources.STEEL, 2);
      player.steel += 4;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P21',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.steel(2)).br;
        b.steel(4);
      }),
      description: 'Increase your steel production 2 steps. Gain 4 steel.',
    }
}
