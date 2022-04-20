import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IActionCard, ICard} from '../ICard';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../common/Resources';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {digit} from '../Options';

export class Astrodrill extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ASTRODRILL,
      tags: [Tags.SPACE],
      startingMegaCredits: 35,
      resourceType: CardResource.ASTEROID,

      metadata: {
        cardNumber: 'R21',
        description: 'You start with 35 M€ and 3 asteroid resources.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(35).nbsp.asteroids(3, {digit});
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action(undefined, (eb) => {
              eb.empty().startAction.asteroids(1).asterix().slash().wild(1).or();
            });
            ce.vSpace();
            ce.action('Add an asteroid resource to ANY card OR gain any standard resource, OR remove an asteroid resource from this card to gain 3 titanium.', (eb) => {
              eb.asteroids(1).startAction.titanium(3, {digit});
            });
          });
        }),
      },
    });
  }
  public override resourceCount = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const asteroidCards = player.getResourceCards(CardResource.ASTEROID);
    const opts: Array<SelectOption | SelectCard<ICard>> = [];

    const gainStandardResource = new SelectOption('Gain a standard resource', 'Gain', () => {
      return new OrOptions(
        new SelectOption('Gain 1 titanium', 'Gain titanium', () => {
          player.addResource(Resources.TITANIUM, 1, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 1 steel', 'Gain steel', () => {
          player.addResource(Resources.STEEL, 1, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 1 plant', 'Gain plant', () => {
          player.addResource(Resources.PLANTS, 1, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 1 energy', 'Gain energy', () => {
          player.addResource(Resources.ENERGY, 1, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 1 heat', 'Gain heat', () => {
          player.addResource(Resources.HEAT, 1, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 1 M€', 'Gain M€', () => {
          player.addResource(Resources.MEGACREDITS, 1, {log: true});
          return undefined;
        }),
      );
    });

    const addResourceToSelf = new SelectOption('Add 1 asteroid to this card', 'Add asteroid', () => {
      player.addResourceTo(this, {log: true});

      return undefined;
    });

    const addResource = new SelectCard(
      'Select card to add 1 asteroid',
      'Add asteroid',
      asteroidCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {log: true});

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
