import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {GainProduction} from '../../deferredActions/GainProduction';

export class PowerSupplyConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_SUPPLY_CONSORTIUM,
      tags: [Tag.ENERGY],
      cost: 5,

      requirements: CardRequirements.builder((b) => b.tag(Tag.ENERGY, 2)),
      metadata: {
        cardNumber: '160',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1, {all}).br;
            pb.plus().energy(1);
          });
        }),
        description: 'Requires 2 Power tags. Decrease any energy production 1 step and increase your own 1 step.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.ENERGY, {count: 1, stealing: true}));
    player.game.defer(new GainProduction(player, Resources.ENERGY, {count: 1}));
    return undefined;
  }
}
