import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class IndustrialMicrobes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INDUSTRIAL_MICROBES,
      tags: [Tags.MICROBE, Tags.BUILDING],
      cost: 12,
      productionBox: Units.of({energy: 1, steel: 1}),

      metadata: {
        cardNumber: '158',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).steel(1));
        }),
        description: 'Increase your Energy production and your steel production 1 step each.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.STEEL, 1);
    return undefined;
  }
}

