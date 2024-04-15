import {IPlayer} from '../IPlayer';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {Priority} from '../deferredActions/Priority';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {IProjectCard} from '../cards/IProjectCard';
import {isPlanetaryTag, PLANETARY_TAGS, PlanetaryTag} from '../pathfinders/PathfindersData';
import {intersection} from '../../common/utils/utils';
import {message} from '../logs/MessageBuilder';
import {Message} from '../../common/logs/Message';

/**
 * Declare what tag a new card has. Must occur before anything else, including
 * the standard behavior that comes from onCardPlayed.
 *
 * To handle the onCardPlayed nature, `Player` doesn't call onCardPlayed
 * when the card has a clone tag, and instead defers that call.
 * That's why it calls onCardPlayed here.
 */
export class DeclareCloneTag extends DeferredAction<PlanetaryTag> {
  public constructor(
    player: IPlayer,
    public card: IProjectCard & ICloneTagCard,
    public title: string | Message | undefined = undefined) {
    super(player, Priority.DECLARE_CLONE_TAG);
  }

  public execute() {
    // This finds all the valid tags in the game.
    // It also relies in `intersection` preserving order of the first array
    // which defines the order of tags in SelectOption.
    const tags = intersection(
      PLANETARY_TAGS,
      this.player.game.tags.filter(isPlanetaryTag));

    const options = tags.map((tag) => {
      return new SelectOption(tag, 'Choose').andThen(() => {
        this.card.cloneTag = tag;
        this.player.game.log('${0} turned the clone tag on ${1} into a ${2} tag',
          (b) => b.player(this.player).card(this.card).string(tag));
        this.player.onCardPlayed(this.card);
        this.cb(tag);
        return undefined;
      });
    });
    const orOptions = new OrOptions(...options);
    if (this.title === undefined) {
      this.title = message('Assign the clone tag for ${0}', (b) => b.cardName(this.card.name));
    }
    orOptions.title = this.title;
    return orOptions;
  }
}
