import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {PlayerInput} from '../../PlayerInput';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {LogHelper} from '../../LogHelper';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {Payment} from '../../../common/inputs/Payment';

export class CometAiming extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.COMET_AIMING,
      tags: [Tag.SPACE],
      cost: 17,
      resourceType: CardResource.ASTEROID,

      metadata: {
        cardNumber: 'X16',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 asteroid resource to ANY CARD.', (eb) => {
            eb.titanium(1).startAction.asteroids(1).asterix();
          }).br;
          b.or().br;
          b.action('Remove 1 asteroid here to place an ocean.', (eb) => {
            eb.asteroids(1).startAction.oceans(1);
          });
        }),
      },
    });
  }

  private canPlaceOcean(player: IPlayer) {
    return player.game.canAddOcean() && player.canAfford({cost: 0, tr: {oceans: 1}});
  }

  public canAct(player: IPlayer): boolean {
    if (player.titanium > 0) {
      return true;
    }
    return this.resourceCount > 0 && this.canPlaceOcean(player);
  }

  public action(player: IPlayer) {
    const asteroidCards = player.getResourceCards(CardResource.ASTEROID);

    const addAsteroidToSelf = function() {
      player.pay(Payment.of({titanium: 1}));
      player.addResourceTo(asteroidCards[0], {log: true});
      return undefined;
    };

    const addAsteroidToCard = new SelectCard(
      'Select card to add 1 asteroid',
      'Add asteroid',
      asteroidCards)
      .andThen(([card]) => {
        player.pay(Payment.of({titanium: 1}));
        player.addResourceTo(card, {log: true});
        return undefined;
      });

    const spendAsteroidResource = () => {
      this.resourceCount--;
      LogHelper.logRemoveResource(player, this, 1, 'place an ocean');
      player.game.defer(new PlaceOceanTile(player));
      return undefined;
    };

    if (this.resourceCount === 0) {
      if (asteroidCards.length === 1) return addAsteroidToSelf();
      return addAsteroidToCard;
    }

    if (player.titanium === 0) return spendAsteroidResource();

    const availableActions: Array<PlayerInput> = [];

    if (this.canPlaceOcean(player)) {
      availableActions.push(new SelectOption('Remove an asteroid resource to place an ocean', 'Remove asteroid').andThen(spendAsteroidResource));
    }

    if (asteroidCards.length === 1) {
      availableActions.push(new SelectOption('Spend 1 titanium to gain 1 asteroid resource', 'Spend titanium').andThen(addAsteroidToSelf));
    } else {
      availableActions.push(addAsteroidToCard);
    }

    if (availableActions.length === 1) {
      const action = availableActions[0];

      if (action instanceof SelectOption) return action.cb(undefined);
      return availableActions[0]; // SelectCard
    }

    return new OrOptions(...availableActions);
  }
}
