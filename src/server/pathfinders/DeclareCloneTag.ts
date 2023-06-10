import {IPlayer} from '../IPlayer';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {IProjectCard} from '../cards/IProjectCard';
import {isPlanetaryTag, PLANETARY_TAGS, PlanetaryTag} from '../pathfinders/PathfindersData';
import {intersection} from '../../common/utils/utils';

/**
 * Declare what tag a new card has. Must occur before anything else, including
 * the standard behavior that comes from onCardPlayed.
 *
 * To handle the onCardPlayed nature, `Player` doesn't call onCardPlayed
 * when the card has a clone tag, and instead defers that call.
 * That's why it calls onCardPlayed here.
 */
export class DeclareCloneTag extends DeferredAction {
  public constructor(
    player: IPlayer,
    public card: IProjectCard & ICloneTagCard,
    public cb: (tag: PlanetaryTag) => void = () => {},
    public title: string = '') {
    super(player, Priority.DECLARE_CLONE_TAG);
    if (this.title === '') {
      this.title = `Assign the clone tag for ${card.name}`;
    }
  }

  public execute() {
    // This finds all the valid tags in the game.
    // It also relies in `intersection` preserving order of the first array
    // which defines the order of tags in SelectOption.
    const tags = intersection(
      PLANETARY_TAGS,
      this.player.game.tags.filter(isPlanetaryTag));

    const options = tags.map((tag) => {
      return new SelectOption(tag, 'Choose', () => {
        this.card.cloneTag = tag;
        this.player.game.log('${0} turned the clone tag on ${1} into a ${2} tag',
          (b) => b.player(this.player).card(this.card).string(tag));
        this.player.onCardPlayed(this.card);
        this.cb(tag);
        return undefined;
      });
    });
    const orOptions = new OrOptions(...options);
    orOptions.title = 'Select a new tag for this clone tag.';
    return orOptions;
  }
}
