import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard, IResourceCard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {LogHelper} from '../../LogHelper';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidRights extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ASTEROID_RIGHTS,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 10,
      resourceType: ResourceType.ASTEROID,

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
  public resourceCount = 0;

  public play() {
    this.resourceCount = 2;
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(1) || this.resourceCount > 0;
  }

  public action(player: Player) {
    const canAddAsteroid = player.canAfford(1);
    const hasAsteroids = this.resourceCount > 0;
    const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);

    const spendAsteroidOption = new SelectOption('Remove 1 asteroid on this card to increase M€ production 1 step OR gain 2 titanium', 'Remove asteroid', () => {
      this.resourceCount--;

      return new OrOptions(
        new SelectOption('Gain 2 titanium', 'Select', () => {
          player.titanium += 2;
          LogHelper.logRemoveResource(player, this, 1, 'gain 2 titanium');
          return undefined;
        }),
        new SelectOption('Increase M€ production 1 step', 'Select', () => {
          player.addProduction(Resources.MEGACREDITS, 1);
          LogHelper.logRemoveResource(player, this, 1, 'increase M€ production 1 step');
          return undefined;
        }),
      );
    });

    const addAsteroidToSelf = new SelectOption('Add 1 asteroid to this card', 'Add asteroid', () => {
      player.game.defer(new SelectHowToPayDeferred(player, 1, {title: 'Select how to pay for asteroid'}));
      player.addResourceTo(this, {log: true});

      return undefined;
    });

    const addAsteroidOption = new SelectCard('Select card to add 1 asteroid', 'Add asteroid', asteroidCards, (foundCards: Array<ICard>) => {
      player.game.defer(new SelectHowToPayDeferred(player, 1, {title: 'Select how to pay for asteroid'}));
      player.addResourceTo(foundCards[0], {log: true});

      return undefined;
    });

    // Spend asteroid
    if (!canAddAsteroid) return spendAsteroidOption.cb();

    // Add asteroid to any card
    if (!hasAsteroids) {
      if (asteroidCards.length === 1) return addAsteroidToSelf.cb();
      return addAsteroidOption;
    }

    const opts: Array<SelectOption | SelectCard<ICard>> = [];
    opts.push(spendAsteroidOption);
    asteroidCards.length === 1 ? opts.push(addAsteroidToSelf) : opts.push(addAsteroidOption);

    return new OrOptions(...opts);
  }
}
