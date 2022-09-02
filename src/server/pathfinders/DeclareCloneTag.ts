import {Player} from '../Player';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Tag} from '../../common/cards/Tag';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {IProjectCard} from '../cards/IProjectCard';
import {PlanetaryTag} from './PathfindersExpansion';

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
    player: Player,
    public card: IProjectCard & ICloneTagCard,
    public cb: (tag: PlanetaryTag) => void = () => {},
    public title: string = '') {
    super(player, Priority.DECLARE_CLONE_TAG);
    if (this.title === '') {
      this.title = `Assign the clone tag for ${card.name}`;
    }
  }

  public execute() {
    const tags: Array<PlanetaryTag> = [Tag.EARTH, Tag.JOVIAN, Tag.MARS];
    if (this.player.game.gameOptions.venusNextExtension === true) {
      tags.push(Tag.VENUS);
    }
    if (this.player.game.gameOptions.moonExpansion === true) {
      tags.push(Tag.MOON);
    }

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
