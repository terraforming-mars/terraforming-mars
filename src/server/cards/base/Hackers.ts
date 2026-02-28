import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Hackers extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.HACKERS,
      cost: 3,
      victoryPoints: -1,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: '125',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).megacredits(1, {all}).br;
            pb.plus().megacredits(2);
          });
        }),
        description: 'Decrease your energy production 1 step and each opponent\'s M€ production 1 step. Increase your M€ production 2 steps.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    for (const opponent of player.opponents) {
      opponent.production.add(Resource.MEGACREDITS, -1, {log: true, from: {player}, stealing: true});
    }
    return undefined;
  }
}

