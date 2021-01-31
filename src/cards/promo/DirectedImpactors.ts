import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard, ICard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class DirectedImpactors extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DIRECTED_IMPACTORS,
      tags: [Tags.SPACE],
      cost: 8,
      resourceType: ResourceType.ASTEROID,

      metadata: {
        cardNumber: 'X18',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 MC to add 1 asteroid to ANY CARD (titanium may be used to pay for this).', (eb) => {
            eb.megacredits(6).titanium(1).brackets.startAction.asteroids(1).asterix();
          }).br;
          b.or().br;
          b.action('Remove 1 asteroid here to raise temperature 1 step.', (eb) => {
            eb.asteroids(1).startAction.temperature(1);
          });
        }),
      },
    });
  }
    public resourceCount = 0;

    public play() {
      return undefined;
    }

    public canAct(player: Player): boolean {
      const cardHasResources = this.resourceCount > 0;
      const canPayForAsteroid = player.canAfford(6, false, true);

      if (player.game.getTemperature() === MAX_TEMPERATURE && cardHasResources) return true;
      if (canPayForAsteroid) return true;

      if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
        return player.canAfford(REDS_RULING_POLICY_COST) && cardHasResources;
      }

      return cardHasResources;
    }

    public action(player: Player) {
      const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);
      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Pay 6 to add 1 asteroid to a card', 'Pay', () => this.addResource(player, asteroidCards));
      const spendResource = new SelectOption('Remove 1 asteroid to raise temperature 1 step', 'Remove asteroid', () => this.spendResource(player));
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS);
      const temperatureIsMaxed = player.game.getTemperature() === MAX_TEMPERATURE;

      if (this.resourceCount > 0) {
        if (!redsAreRuling || temperatureIsMaxed || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
          opts.push(spendResource);
        }
      } else {
        return this.addResource(player, asteroidCards);
      }

      if (player.canAfford(6, false, true)) {
        opts.push(addResource);
      } else {
        return this.spendResource(player);
      }

      return new OrOptions(...opts);
    }

    private addResource(player: Player, asteroidCards: ICard[]) {
      player.game.defer(new SelectHowToPayDeferred(player, 6, {canUseTitanium: true, title: 'Select how to pay for Directed Impactors action'}));

      if (asteroidCards.length === 1) {
        player.addResourceTo(this);
        LogHelper.logAddResource(player, this);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 1 asteroid',
        'Add asteroid',
        asteroidCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0]);
          LogHelper.logAddResource(player, foundCards[0]);
          return undefined;
        },
      );
    }

    private spendResource(player: Player) {
      this.resourceCount--;
      LogHelper.logRemoveResource(player, this, 1, 'raise temperature 1 step');
      player.game.increaseTemperature(player, 1);
      return undefined;
    }
}
