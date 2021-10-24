import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class DeepWellHeating extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DEEP_WELL_HEATING,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 13,
      productionBox: Units.of({energy: 1}),
      tr: {temperature: 1},

      metadata: {
        cardNumber: '003',
        description: 'Increase your Energy production 1 step. Increase temperature 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).temperature(1);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return player.game.increaseTemperature(player, 1);
  }
}
