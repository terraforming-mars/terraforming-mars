import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Phase} from '../../../common/Phase';

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

  // Tracks the game's actionId when this card last triggered, to ensure once-per-action behavior.
  // actionId increments each time a player is presented with new action choices, and stays stable
  // through card effects and deferred actions within the same action.
  // Not serialized — resets on server restart, which is safe since the player must take a new action.
  private lastActionId = -1;

  public onProductionGain(player: IPlayer, _resource: Resource, amount: number) {
    if (amount <= 0) return;

    const game = player.game;

    // Do not trigger during production phase, solar phase, or other non-action phases
    if (game.phase === Phase.PRODUCTION || game.phase === Phase.SOLAR || game.phase === Phase.END || game.phase === Phase.INTERGENERATION) {
      return;
    }
    // Only trigger for the active player (prevents triggering on other players' turns)
    if (game.activePlayer.id !== player.id) return;

    // Once per action: actionId is stable through card effects and deferred actions
    if (this.lastActionId !== game.actionId) {
      player.stock.add(Resource.MEGACREDITS, 2);
      game.log('${0} gained ${1} ${2} from ${3}',
        (b) => b.player(player).number(2).string('M€').card(this));
      this.lastActionId = game.actionId;
    }
  }
}

