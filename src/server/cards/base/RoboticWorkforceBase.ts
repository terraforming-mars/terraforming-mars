import {Tag} from '../../../common/cards/Tag';
import {Card, StaticCardProperties} from '../Card';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {ICard} from '../ICard';
import {Behavior} from '../../behavior/Behavior';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';
import {PlayerInput} from '../..//PlayerInput';

export abstract class RoboticWorkforceBase extends Card {
  constructor(properties: StaticCardProperties) {
    super(properties);
  }

  /**
   * Returns a copy of behavior with just `production` and `decreaseAnyProduction` fields.
   */
  protected productionBehavior(behavior: Behavior): Behavior {
    const filtered: Behavior = {};
    if (behavior.production !== undefined) {
      filtered.production = behavior.production;
    }
    if (behavior.decreaseAnyProduction !== undefined) {
      filtered.decreaseAnyProduction = behavior.decreaseAnyProduction;
    }
    return filtered;
  }

  protected isCardApplicable(card: ICard, player: IPlayer): boolean {
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

  protected getPlayableBuildingCards(player: IPlayer): ReadonlyArray<ICard> {
    return player.tableau.filter((card) => this.isCardApplicable(card, player));
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.getPlayableBuildingCards(player).length > 0;
  }

  protected selectBuildingCard(player: IPlayer, cards: ReadonlyArray<ICard>, title: string, cb: (card: ICard) => PlayerInput | undefined = () => undefined) {
    if (cards.length === 0) {
      return undefined;
    }
    return new SelectCard(title, 'Copy', cards)
      .andThen(([card]) => {
        player.game.log('${0} copied ${1} production with ${2}', (b) =>
          b.player(player).card(card).card(this));

        if (card.produce) {
          card.produce(player);
        } else if (card.behavior !== undefined) {
          getBehaviorExecutor().execute(this.productionBehavior(card.behavior), player, card);
        }
        return cb(card);
      });
  }
}
