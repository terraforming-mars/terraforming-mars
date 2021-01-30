import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GreatEscarpmentConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREAT_ESCARPMENT_CONSORTIUM,
      cost: 6,

      metadata: {
        cardNumber: '061',
        requirements: CardRequirements.builder((b) => b.production(Resources.STEEL)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().steel(-1).any.br;
            pb.plus().steel(1);
          });
        }),
        description: 'Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.STEEL) >= 1;
  }
  public play(player: Player) {
    player.game.defer(new DecreaseAnyProduction(player, Resources.STEEL, 1));
    player.addProduction(Resources.STEEL);
    return undefined;
  }
}
