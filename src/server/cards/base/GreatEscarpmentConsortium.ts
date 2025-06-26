import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {GainProduction} from '../../deferredActions/GainProduction';

export class GreatEscarpmentConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GREAT_ESCARPMENT_CONSORTIUM,
      cost: 6,

      requirements: {production: Resource.STEEL, count: 1},
      metadata: {
        cardNumber: '061',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().steel(-1, {all}).br;
            pb.plus().steel(1);
          });
        }),
        description: 'Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resource.STEEL, {count: 1, stealing: true}));
    player.game.defer(new GainProduction(player, Resource.STEEL, {count: 1, log: true}));
    return undefined;
  }
}
