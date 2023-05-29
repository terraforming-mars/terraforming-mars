import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {GainProduction} from '../../deferredActions/GainProduction';

export class SpentFuel extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SPENT_FUEL,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 14,

      requirements: CardRequirements.builder((b) => b.tag(Tag.RADIATION).tag(Tag.POWER).tag(Tag.SCIENCE)),
      metadata: {
        cardNumber: 'N42',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().titanium(1, {all}).br;
            pb.plus().steel(1).energy(1);
          });
        }),
        description: 'Requires 1 radiation, 1 power and 1 science tags. Decrease any energy titanium 1 step and increase your steel and energy production 1 step.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resource.TITANIUM, {count: 1, stealing: true}));
    player.game.defer(new GainProduction(player, Resource.STEEL, {count: 1}));
    player.game.defer(new GainProduction(player, Resource.ENERGY, {count: 1}));
    return undefined;
  }
}
