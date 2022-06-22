import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {GainProduction} from '../../deferredActions/GainProduction';

export class EnergyTapping extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ENERGY_TAPPING,
      tags: [Tags.ENERGY],
      cost: 3,
      victoryPoints: -1,

      metadata: {
        cardNumber: '201',
        description: 'Decrease any Energy production 1 step and increase your own 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1, {all}).br;
            pb.plus().energy(1);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.ENERGY, {count: 1, stealing: true}));
    player.game.defer(new GainProduction(player, Resources.ENERGY, {count: 1}));
    return undefined;
  }
}
