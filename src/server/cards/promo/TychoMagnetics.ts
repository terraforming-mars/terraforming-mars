import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {SelectAmount} from '../../inputs/SelectAmount';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class TychoMagnetics extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.TYCHO_MAGNETICS,
      tags: [Tag.POWER, Tag.SCIENCE],
      startingMegaCredits: 42,
      behavior: {
        production: {energy: 1},
      },

      metadata: {
        cardNumber: 'XC02', // Rename
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
    return player.energy > 0 && player.game.projectDeck.canDraw(1);
  }

  public action(player: IPlayer) {
    const max = Math.min(player.energy, player.game.projectDeck.size());
    return new SelectAmount('Select amount of energy to spend', 'OK', 1, max)
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
