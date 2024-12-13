import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';
import {message} from '../../logs/MessageBuilder';


export class Recession extends PreludeCard {
  constructor() {
    super({
      name: CardName.RECESSION,

      behavior: {
        stock: {megacredits: 10},
      },

      metadata: {
        cardNumber: 'P59',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(-5, {all}).asterix().production((pb) => pb.megacredits(-1, {all})).asterix().megacredits(10);
        }),
        description: 'EACH OPPONENT loses 5 M€ and decreases their M€ production 1 step. You gain 10 M€.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    for (const target of player.getOpponents()) {
      if (target.production.megacredits === -5) {
        return false;
      }
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    for (const target of player.getOpponents()) {
      const m = message('Lose 5 M€ and 1 M€ production');
      target.maybeBlockAttack(player, m, (proceed) => {
        if (proceed) {
          target.production.add(Resource.MEGACREDITS, -1, {log: true, from: player});
          target.stock.deduct(Resource.MEGACREDITS, Math.min(target.megaCredits, 5), {log: true, from: player});
        }
        return undefined;
      });
    }
    return undefined;
  }
}
