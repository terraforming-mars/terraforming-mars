import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class FueledGenerators extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FUELED_GENERATORS,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 1,
      productionBox: Units.of({energy: 1, megacredits: -1}),

      metadata: {
        cardNumber: '100',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(1).br;
            pb.plus().energy(1);
          });
        }),
        description: 'Decrease your M€ production 1 step and increase your Energy production 1 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}
