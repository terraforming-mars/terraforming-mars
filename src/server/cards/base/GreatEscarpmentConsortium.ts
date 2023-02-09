import {IProjectCard} from '../IProjectCard';
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

export class GreatEscarpmentConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREAT_ESCARPMENT_CONSORTIUM,
      cost: 6,

      requirements: CardRequirements.builder((b) => b.production(Resources.STEEL)),
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

  public override bespokePlay(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.STEEL, {count: 1, stealing: true}));
    player.game.defer(new GainProduction(player, Resources.STEEL, {count: 1}));
    return undefined;
  }
}
