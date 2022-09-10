import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {LogHelper} from '../../LogHelper';
import {PlayerInput} from '../../PlayerInput';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidRights extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ASTEROID_RIGHTS,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 10,
      resourceType: CardResource.ASTEROID,

      behavior: {
        addResources: 2,
      },

      metadata: {
        cardNumber: 'X31',
        description: 'Add 2 asteroids to this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 M€ to add 1 asteroid to ANY card.', (eb) => {
            eb.megacredits(1).startAction.asteroids(1).asterix().nbsp.or();
          }).br;
          b.action('Spend 1 asteroid here to increase M€ production 1 step OR gain 2 titanium.', (eb) => {
            eb.asteroids(1)
              .startAction.production((pb) => pb.megacredits(1))
              .or()
              .titanium(2);
          }).br;
          b.asteroids(2);
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.canAfford(1) || this.resourceCount > 0;
  }

  public action(player: Player) {
    const canAddAsteroid = player.canAfford(1);
    const hasAsteroids = this.resourceCount > 0;
    const asteroidCards = player.getResourceCards(CardResource.ASTEROID);

    const gainTitaniumOption = new SelectOption('Remove 1 asteroid on this card to gain 2 titanium', 'Remove asteroid', () => {
      this.resourceCount--;
      player.titanium += 2;
      LogHelper.logRemoveResource(player, this, 1, 'gain 2 titanium');
      return undefined;
    });

    const increaseMcProdOption = new SelectOption('Remove 1 asteroid on this card to increase M€ production 1 step', 'Remove asteroid', () => {
      this.resourceCount--;
      player.production.add(Resources.MEGACREDITS, 1);
      LogHelper.logRemoveResource(player, this, 1, 'increase M€ production 1 step');
      return undefined;
    });

    const addAsteroidToSelf = new SelectOption('Add 1 asteroid to this card', 'Add asteroid', () => {
      player.game.defer(new SelectPaymentDeferred(player, 1, {title: 'Select how to pay for asteroid'}));
      player.addResourceTo(this, {log: true});

      return undefined;
    });

    const addAsteroidOption = new SelectCard('Select card to add 1 asteroid', 'Add asteroid', asteroidCards, ([card]) => {
      player.game.defer(new SelectPaymentDeferred(player, 1, {title: 'Select how to pay for asteroid'}));
      player.addResourceTo(card, {log: true});

      return undefined;
    });

    // Spend asteroid
    if (!canAddAsteroid) return new OrOptions(gainTitaniumOption, increaseMcProdOption);

    // Add asteroid to any card
    if (!hasAsteroids) {
      if (asteroidCards.length === 1) return addAsteroidToSelf.cb();
      return addAsteroidOption;
    }

    const opts: Array<PlayerInput> = [];
    opts.push(gainTitaniumOption);
    opts.push(increaseMcProdOption);
    asteroidCards.length === 1 ? opts.push(addAsteroidToSelf) : opts.push(addAsteroidOption);

    return new OrOptions(...opts);
  }
}
