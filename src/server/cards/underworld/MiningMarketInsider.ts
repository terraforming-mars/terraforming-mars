import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';
import {all, digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {OncePerAction} from '@/server/utils/OncePerAction';

export class MiningMarketInsider extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MINING_MARKET_INSIDER,
      cost: 5,
      tags: [Tag.EARTH],
      resourceType: CardResource.DATA,

      action: {
        spend: {resourcesHere: 4},
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'U046',
        renderData: CardRenderer.builder((b) => {
          b.effect('After any player identifies 1 or more underground resources (at once), add 1 data resource to this card.',
            (ab) => ab.identify(1, {all}).startEffect.resource(CardResource.DATA)).br;
          b.action('Spend 4 data resources on this card to draw a card.',
            (ab) => ab.resource(CardResource.DATA, {amount: 4, digit}).startAction.cards(1));
        }),
      },
    });
  }

  private readonly oncePerAction = new OncePerAction();

  public onIdentificationByAnyPlayer(cardOwner: IPlayer) {
    this.oncePerAction.oncePerAction(cardOwner.game, () => {
      cardOwner.addResourceTo(this);
    });
  }
}

