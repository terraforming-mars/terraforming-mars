import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {IActionCard, ICard} from '../ICard';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Astrodrill extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ASTRODRILL,
      tags: [Tags.SPACE],
      startingMegaCredits: 38,
      resourceType: ResourceType.ASTEROID,

      metadata: {
        cardNumber: 'R21',
        description: 'You start with 38 MC and 3 asteroid resources.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(38).nbsp.asteroids(3).digit;
          b.corpBox('action', (ce) => {
            ce.vSpace(CardRenderItemSize.LARGE);
            ce.action(undefined, (eb) => {
              eb.empty().startAction.asteroids(1).asterix().slash().wild(1).or();
            });
            ce.vSpace();
            ce.action('Add an asteroid resource to ANY card OR gain any standard resource, OR remove an asteroid resource from this card to gain 3 titanium.', (eb) => {
              eb.asteroids(1).startAction.titanium(3).digit;
            });
          });
        }),
      },
    });
  }
    public resourceCount = 0;

    public canAct(): boolean {
      return true;
    }

    public action(player: Player) {
      const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);
      const opts: Array<SelectOption | SelectCard<ICard>> = [];

      const gainStandardResource = new SelectOption('Gain a standard resource', 'Gain', () => {
        return new OrOptions(
          new SelectOption('Gain 1 titanium', 'Gain titanium', () => {
            player.titanium += 1;
            LogHelper.logGainStandardResource(player, Resources.TITANIUM);
            return undefined;
          }),
          new SelectOption('Gain 1 steel', 'Gain steel', () => {
            player.steel += 1;
            LogHelper.logGainStandardResource(player, Resources.STEEL);
            return undefined;
          }),
          new SelectOption('Gain 1 plant', 'Gain plant', () => {
            player.plants += 1;
            LogHelper.logGainStandardResource(player, Resources.PLANTS);
            return undefined;
          }),
          new SelectOption('Gain 1 energy', 'Gain energy', () => {
            player.energy += 1;
            LogHelper.logGainStandardResource(player, Resources.ENERGY);
            return undefined;
          }),
          new SelectOption('Gain 1 heat', 'Gain heat', () => {
            player.heat += 1;
            LogHelper.logGainStandardResource(player, Resources.HEAT);
            return undefined;
          }),
          new SelectOption('Gain 1 MC', 'Gain MC', () => {
            player.megaCredits += 1;
            LogHelper.logGainStandardResource(player, Resources.MEGACREDITS);
            return undefined;
          }),
        );
      });

      const addResourceToSelf = new SelectOption('Add 1 asteroid to this card', 'Add asteroid', () => {
        player.addResourceTo(this);
        LogHelper.logAddResource(player, this);

        return undefined;
      });

      const addResource = new SelectCard(
        'Select card to add 1 asteroid',
        'Add asteroid',
        asteroidCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          LogHelper.logAddResource(player, foundCards[0]);

          return undefined;
        },
      );

      const spendResource = new SelectOption('Remove 1 asteroid on this card to gain 3 titanium', 'Remove asteroid', () => {
        this.resourceCount--;
        player.titanium += 3;
        LogHelper.logRemoveResource(player, this, 1, 'gain 3 titanium');

        return undefined;
      });

      if (this.resourceCount > 0) opts.push(spendResource);
      asteroidCards.length === 1 ? opts.push(addResourceToSelf) : opts.push(addResource);
      opts.push(gainStandardResource);

      return new OrOptions(...opts);
    }

    public play() {
      this.resourceCount = 3;
      return undefined;
    }
}
