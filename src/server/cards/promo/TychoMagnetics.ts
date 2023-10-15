import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardType} from '../../../common/cards/CardType';
import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {SelectAmount} from '../../inputs/SelectAmount';

export class TychoMagnetics extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.TYCHO_MAGNETICS,
      tags: [Tag.POWER, Tag.SCIENCE],
      startingMegaCredits: 42,
      behavior: {
        production: {energy: 1},
      },

      metadata: {
        cardNumber: '',
        description: 'You start with 42 M€. Increase your energy production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.energy(1)).nbsp.megacredits(42);
          b.corpBox('action', (cb) => {
            cb.action('Spend any amount of energy to draw the that many cards. Keep 1 and discard the rest.', (ab) => {
              ab.text('X').energy(1).startAction.text('X').cards(1).text('KEEP 1');
            });
          });
        }),
      },
    });
  }

  // TODO(kberg): this is a direct copy from hi-tech lab.
  public canAct(player: IPlayer): boolean {
    return player.energy > 0;
  }

  public action(player: IPlayer) {
    return new SelectAmount('Select amount of energy to spend', 'OK', 1, player.energy)
      .andThen((amount) => {
        player.stock.deduct(Resource.ENERGY, amount);
        player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(amount));
        if (amount === 1) {
          player.drawCard();
          return undefined;
        }
        player.drawCardKeepSome(amount, {keepMax: 1});
        return undefined;
      });
  }
}
