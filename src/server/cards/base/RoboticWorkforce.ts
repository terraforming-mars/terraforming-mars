import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {ICard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';
import {Behavior} from '../../behavior/Behavior';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';

export class RoboticWorkforce extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tag.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', Size.SMALL, true).nbsp;
          b.production((pb) => pb.building(1, {played}));
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }

  /**
   * Returns a copy of behavior with just `production` and `decreaseAnyProduction` fields.
   */
  private productionBehavior(behavior: Behavior): Behavior {
    const filtered: Behavior = {};
    if (behavior.production !== undefined) {
      filtered.production = behavior.production;
    }
    if (behavior.decreaseAnyProduction !== undefined) {
      filtered.decreaseAnyProduction = behavior.decreaseAnyProduction;
    }
    return filtered;
  }

  private isCardApplicable(card: ICard, player: Player): boolean {
    if (!card.tags.includes(Tag.BUILDING) && !card.tags.includes(Tag.WILD)) {
      return false;
    }
    if (card.name === CardName.SPECIALIZED_SETTLEMENT) {
      return player.production.energy >= 1;
    }

    if (card.produce !== undefined) {
      return true;
    }

    if (card.behavior !== undefined) {
      const productionBehavior = this.productionBehavior(card.behavior);
      if (Object.keys(productionBehavior).length > 0) {
        return getBehaviorExecutor().canExecute(productionBehavior, player, card);
      }
    }

    // Card has no production box.
    return false;
  }

  private getAvailableCards(player: Player): Array<ICard> {
    return player.tableau.filter((card) => this.isCardApplicable(card, player));
  }

  public override bespokeCanPlay(player: Player): boolean {
    return this.getAvailableCards(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    const availableCards = this.getAvailableCards(player);

    if (availableCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select builder card to copy', 'Copy', availableCards, ([card]) => {
      player.game.log('${0} copied ${1} production with ${2}', (b) =>
        b.player(player).card(card).card(this));

      if (card.produce) {
        card.produce(player);
      } else if (card.behavior !== undefined) {
        getBehaviorExecutor().execute(this.productionBehavior(card.behavior), player, card);
      }
      return undefined;
    });
  }
}
