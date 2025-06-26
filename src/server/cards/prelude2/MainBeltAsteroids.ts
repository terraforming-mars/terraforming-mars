import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IActionCard, ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {ActivePreludeCard} from './ActivePreludeCard';
import {Resource} from '../../../common/Resource';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class MainBeltAsteroids extends ActivePreludeCard implements IActionCard {
  constructor() {
    super({
      name: CardName.MAIN_BELT_ASTEROIDS,
      tags: [Tag.SPACE],
      resourceType: CardResource.ASTEROID,
      victoryPoints: {resourcesHere: {}, per: 2},

      startingMegacredits: -5,

      action: {
        addResourcesToAnyCard: {type: CardResource.ASTEROID, count: 1},
      },

      metadata: {
        cardNumber: 'P53',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 asteroid to ANY CARD.', (ab) => {
            ab.empty().startAction.resource(CardResource.ASTEROID).asterix();
          }).nbsp.effect('When gaining an asteroid HERE, gain 1 titanium.', (ab) => {
            ab.resource(CardResource.ASTEROID).startEffect.titanium(1);
          }).br.megacredits(-5);
        }),
        description: 'Lose 5 M€. 1 VP per 2 asteroids here.',
      },
    });
  }

  public onResourceAdded(player: IPlayer, card: ICard, count: number) {
    if (card === this) {
      player.stock.add(Resource.TITANIUM, count, {log: true, from: this});
    }
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.canAfford(5);
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 5));
    return undefined;
  }
}
