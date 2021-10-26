import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class MicrosingularityPlant extends Card {
  constructor() {
    super({
      name: CardName.MICROSINGULARITY_PLANT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY],
      cost: 10,
      requirements: CardRequirements.builder((b) => b.colonyTiles(2, {all})),

      metadata: {
        description: 'Requires 2 colonies on the Moon. Increase your energy production 2 steps.',
        cardNumber: 'M40',
        // TODO(kberg): requirements: CardRequirements.text('2 colonies @moon'),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
      },
    });
  };

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2, {log: true});
    return undefined;
  }
}
