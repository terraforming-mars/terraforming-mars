import {IActionCard, ICard, IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../common/ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';

export class AerialMappers extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.AERIAL_MAPPERS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 11,
      resourceType: ResourceType.FLOATER,
      victoryPoints: 1,

      metadata: {
        cardNumber: '213',
        renderData: CardRenderer.builder((b) => {
          b.action('Add floater to ANY card.', (be) => {
            be.empty().startAction.floaters(1).asterix();
          }).br;
          b.or(Size.SMALL).br;
          b.action('Spend one floater here to draw 1 card.', (be) => {
            be.floaters(1).startAction.cards(1);
          });
        }),
      },
    });
  }
  public override resourceCount: number = 0;

  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);
    const opts: Array<SelectOption | SelectCard<ICard>> = [];

    // only one valid target - itself
    if (floaterCards.length === 1 && this.resourceCount === 0) {
      player.addResourceTo(this, {qty: 1, log: true});
      return undefined;
    }

    const addResourceToSelf = new SelectOption('Add 1 floater to this card', 'Add floater', () => {
      player.addResourceTo(this, {qty: 1, log: true});
      return undefined;
    });

    const addResource = new SelectCard('Select card to add 1 floater', 'Add floater', floaterCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {log: true});
      return undefined;
    });

    const spendResource = new SelectOption('Remove 1 floater on this card and draw a card', 'Remove floater', () => {
      this.resourceCount--;
      LogHelper.logRemoveResource(player, this, 1, 'draw a card');
      player.drawCard();
      return undefined;
    });

    if (this.resourceCount > 0) {
      opts.push(spendResource);
      floaterCards.length === 1 ? opts.push(addResourceToSelf) : opts.push(addResource);
    } else {
      return addResource;
    }

    return new OrOptions(...opts);
  }
}
