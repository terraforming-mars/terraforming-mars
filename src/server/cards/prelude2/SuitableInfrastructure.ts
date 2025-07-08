import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

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

  // Behavior is similar in Demetron labs
  // This doesn't need to be serialized. It ensures this is only evaluated once per action.
  // When the server restarts, the player has to take an action anyway.
  private lastAction = -1;
  public onProductionGain(player: IPlayer, _resource: Resource, amount: number) {
    if (player.game.activePlayer.id !== player.id || amount <= 0) {
      return;
    }
    const actionCount = player.game.getActionCount();
    if (this.lastAction !== actionCount) {
      player.stock.add(Resource.MEGACREDITS, 2);
      player.game.log('${0} gained ${1} ${2} from ${3}',
        (b) => b.player(player).number(2).string('M€').card(this));
      this.lastAction = actionCount;
    }
  }
}

