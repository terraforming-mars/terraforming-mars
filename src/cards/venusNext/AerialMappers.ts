import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class AerialMappers implements IActionCard, IProjectCard, IResourceCard {
  public cost = 11;
  public tags = [Tags.VENUS];
  public name = CardName.AERIAL_MAPPERS;
  public cardType = CardType.ACTIVE;
  public resourceType = ResourceType.FLOATER;
  public resourceCount: number = 0;

  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public getVictoryPoints() {
    return 1;
  }
  public action(player: Player) {
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);
    const opts: Array<SelectOption | SelectCard<ICard>> = [];

    // only one valid target - itself
    if (floaterCards.length === 1 && this.resourceCount === 0) {
      this.resourceCount++;
      LogHelper.logAddResource(player, floaterCards[0]);
      return undefined;
    }

    const addResourceToSelf = new SelectOption('Add 1 floater to this card', 'Add floater', () => {
      this.resourceCount++;
      LogHelper.logAddResource(player, floaterCards[0]);
      return undefined;
    });

    const addResource = new SelectCard('Select card to add 1 floater', 'Add floater', floaterCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], 1);
      LogHelper.logAddResource(player, foundCards[0]);
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
  public metadata: CardMetadata = {
    cardNumber: '213',
    renderData: CardRenderer.builder((b) => {
      b.action('Add floater to ANY card.', (be) => {
        be.empty().startAction.floaters(1).asterix();
      }).br;
      b.or(CardRenderItemSize.SMALL).br;
      b.action('Spend one floater here to draw 1 card.', (be) => {
        be.floaters(1).startAction.cards(1);
      });
    }),
    victoryPoints: 1,
  };
}
