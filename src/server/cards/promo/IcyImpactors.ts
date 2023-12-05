import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {SelectSpace} from '../../inputs/SelectSpace';
import {message} from '../../logs/MessageBuilder';
import {CardResource} from '../../../common/CardResource';

export class IcyImpactors extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.ICY_IMPACTORS,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 10,
      resourceType: CardResource.ASTEROID,

      metadata: {
        cardNumber: 'X47',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 10 M€ (titanium may be used) to add 2 asteroids here', (ab) =>
            ab.megacredits(10).openBrackets.titanium(1).closeBrackets.startAction.asteroids(2));
          b.br;
          b.action('Spend 1 asteroid here to place an ocean tile. ' +
            'FIRST PLACER CHOOSES WHERE YOU MUST PLACE IT', (ab) =>
            ab.or().asteroids(1).startAction.oceans(1).asterix());
        }),
      },
    });
  }
  private canAddAsteroids(player: IPlayer) {
    return player.canAfford({cost: 10, titanium: true});
  }
  private canPlaceOcean(player: IPlayer) {
    return this.resourceCount > 0 && player.canAfford({cost: 0, tr: {oceans: 1}});
  }

  canAct(player: IPlayer): boolean {
    return this.canAddAsteroids(player) || this.canPlaceOcean(player);
  }

  action(player: IPlayer) {
    const options = new OrOptions();

    if (this.canAddAsteroids(player)) {
      options.options.push(
        new SelectOption('Spend 10 M€ to add 2 asteroids here').andThen(() => {
          player.game.defer(new SelectPaymentDeferred(player, 10, {canUseTitanium: true})).andThen(() => {
            player.addResourceTo(this, {qty: 2, log: true});
          });
          return undefined;
        }));
    }

    if (this.canPlaceOcean(player)) {
      options.options.push(
        new SelectOption('Spend 1 asteroid here to place an ocean (first player chooses where to place it)').andThen(() => {
          if (player.game.canAddOcean()) {
            player.removeResourceFrom(this, 1);
            const game = player.game;
            game.first.defer(new SelectSpace(message('Select space for ${0} to place an ocean', (b) => b.player(player)), game.board.getAvailableSpacesForOcean(player))
              .andThen((space) => {
                game.addOcean(player, space);
                return undefined;
              }));
          } else {
            player.removeResourceFrom(this, 1, {log: true});
          }
          return undefined;
        }));
    }
    if (options.options.length === 0) {
      return undefined;
    }
    if (options.options.length === 1) {
      return options.options[0].cb();
    }
    return options;
  }
}
