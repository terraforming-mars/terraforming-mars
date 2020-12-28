import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PeroxidePower implements IProjectCard {
    public cost = 7;
    public tags = [Tags.ENERGY, Tags.BUILDING];
    public cardType = CardType.AUTOMATED;
    public name = CardName.PEROXIDE_POWER;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -4;
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -1);
      player.addProduction(Resources.ENERGY, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '089',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().megacredits(1).br;
          pb.plus().energy(2);
        });
      }),
      description: 'Decrease your MC production 1 step and increase your Energy production 2 steps.',
    }
}
