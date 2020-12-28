
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CarbonateProcessing implements IProjectCard {
    public cost = 6;
    public tags = [Tags.BUILDING];
    public name = CardName.CARBONATE_PROCESSING;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.HEAT, 3);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '043',
      description: 'Decrease your Energy production 1 step and increase your heat production 3 steps.',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
        pb.minus().energy(1).br;
        pb.plus().heat(3);
      })),
    }
}
