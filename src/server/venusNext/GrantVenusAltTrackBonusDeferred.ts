import {OrOptions} from '../inputs/OrOptions';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {IPlayer} from '../IPlayer';
import {SelectResources} from '../inputs/SelectResources';
import {newMessage} from '../logs/MessageBuilder';

export class GrantVenusAltTrackBonusDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
    public standardResourceCount: number,
    public wildResource: boolean,
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  private selectStandardResources(count: number) {
    return new SelectResources(
      this.player,
      count,
      `Gain ${count} resources for your Venus track bonus.`,
    );
  }

  public execute() {
    const resourceCards = this.player.getResourceCards(undefined);

    if (this.wildResource === false || resourceCards.length === 0) {
      return this.selectStandardResources(this.standardResourceCount);
    }

    const selectCard = new SelectCard('Add resource to card', 'Add resource', resourceCards)
      .andThen(([card]) => {
        this.player.addResourceTo(card, {qty: 1, log: true});
        return undefined;
      });
    const wild = new OrOptions(selectCard, this.selectStandardResources(1));
    if (this.standardResourceCount > 0) {
      wild.andThen(() => {
        return this.standardResourceCount > 0 ?
          this.selectStandardResources(this.standardResourceCount) :
          undefined;
      });
      wild.title = newMessage(
        'Choose your wild resource bonus, after which you will gain ${0} more distinct standard resources.',
        (b) => b.number(this.standardResourceCount));
    } else {
      wild.title = 'Choose your wild resource bonus.';
    }
    return wild;
  }
}
