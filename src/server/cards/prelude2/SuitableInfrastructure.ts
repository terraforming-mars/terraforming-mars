import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Phase} from '../../../common/Phase';
import {OncePerAction} from '@/server/utils/OncePerAction';

export class SuitableInfrastructure extends PreludeCard {
  constructor() {
    super({
      name: CardName.SUITABLE_INFRASTRUCTURE,
      tags: [Tag.BUILDING],

      behavior: {
        stock: {steel: 5},
      },

      metadata: {
        cardNumber: 'P63',
        description: 'Gain 5 steel.',
        renderData: CardRenderer.builder((b) => {
          b.effect('Once per action you take, gain 2 M€ if you increase any productions.', (eb) => {
            eb.production((pb) => pb.wild(1)).asterix().startEffect.megacredits(2);
          });
          b.br;
          b.steel(5);
        }),
      },
    });
  }

  private readonly oncePerAction = new OncePerAction();

  public onProductionGain(player: IPlayer, _resource: Resource, amount: number) {
    const game = player.game;
    if (game.activePlayer.id !== player.id || amount <= 0) {
      return;
    }
    if (game.phase === Phase.ACTION || game.phase === Phase.PRELUDES) {
      this.oncePerAction.oncePerAction(game, () => {
        player.stock.add(Resource.MEGACREDITS, 2);
        game.log('${0} gained ${1} ${2} from ${3}',
          (b) => b.player(player).number(2).string('M€').card(this));
      });
    }
  }
}

