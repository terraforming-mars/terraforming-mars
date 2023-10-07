import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {MAX_TEMPERATURE} from '../../../common/constants';
import {LogHelper} from '../../LogHelper';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {TITLES} from '../../inputs/titles';

export class DirectedImpactors extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.DIRECTED_IMPACTORS,
      tags: [Tag.SPACE],
      cost: 8,
      resourceType: CardResource.ASTEROID,

      metadata: {
        cardNumber: 'X19',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 M€ to add 1 asteroid to ANY CARD (titanium may be used to pay for this).', (eb) => {
            eb.megacredits(6).openBrackets.titanium(1).closeBrackets.startAction.asteroids(1).asterix();
          }).br;
          b.or().br;
          b.action('Remove 1 asteroid here to raise temperature 1 step.', (eb) => {
            eb.asteroids(1).startAction.temperature(1);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    const cardHasResources = this.resourceCount > 0;
    const canPayForAsteroid = player.canAfford({cost: 6, titanium: true});

    if (player.game.getTemperature() === MAX_TEMPERATURE && cardHasResources) return true;
    if (canPayForAsteroid) return true;

    return player.canAfford({cost: 0, tr: {temperature: 1}}) && cardHasResources;
  }

  public action(player: IPlayer) {
    const asteroidCards = player.getResourceCards(CardResource.ASTEROID);
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Pay 6 M€ to add 1 asteroid to a card', 'Pay').andThen(() => this.addResource(player, asteroidCards));
    const spendResource = new SelectOption('Remove 1 asteroid to raise temperature 1 step', 'Remove asteroid').andThen(() => this.spendResource(player));
    const temperatureIsMaxed = player.game.getTemperature() === MAX_TEMPERATURE;

    if (this.resourceCount > 0) {
      if (!temperatureIsMaxed && player.canAfford({cost: 0, tr: {temperature: 1}})) {
        opts.push(spendResource);
      }
    } else {
      return this.addResource(player, asteroidCards);
    }

    if (player.canAfford({cost: 6, titanium: true})) {
      opts.push(addResource);
    } else {
      return this.spendResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: IPlayer, asteroidCards: ICard[]) {
    player.game.defer(new SelectPaymentDeferred(player, 6, {canUseTitanium: true, title: TITLES.payForCardAction(this.name)}));

    if (asteroidCards.length === 1) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 asteroid',
      'Add asteroid',
      asteroidCards)
      .andThen(([card]) => {
        player.addResourceTo(card, {log: true});
        return undefined;
      });
  }

  private spendResource(player: IPlayer) {
    this.resourceCount--;
    LogHelper.logRemoveResource(player, this, 1, 'raise temperature 1 step');
    player.game.increaseTemperature(player, 1);
    return undefined;
  }
}
