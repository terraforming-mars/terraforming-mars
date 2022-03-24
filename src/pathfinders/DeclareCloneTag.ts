import {Player} from '../Player';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Tags} from '../common/cards/Tags';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {ICard} from '../cards/ICard';
import {CardType} from '../common/cards/CardType';
import {IProjectCard} from '../cards/IProjectCard';

/**
 * Declare what tag a new card has. Must occur before anything else, including
 * the standard behavior that comes from onCardPlayed.
 *
 * To handle the onCardPlayed nature, `Player` doesn't call onCardPlayed
 * when the card has a clone tag, and instead defers that call.
 * That's why it calls onCardPlayed here.
 */
export class DeclareCloneTag implements DeferredAction {
  public priority = Priority.DECLARE_CLONE_TAG;

  public constructor(
    public player: Player,
    public card: ICard & ICloneTagCard,
    public cb: (tag: Tags) => void = () => {},
    public title: string = '') {
    if (this.title === '') {
      this.title = `Assign the clone tag for ${card.name}`;
    }
  }

  public execute() {
    const tags = [Tags.EARTH, Tags.JOVIAN, Tags.MARS];
    if (this.player.game.gameOptions.venusNextExtension === true) {
      tags.push(Tags.VENUS);
    }
    if (this.player.game.gameOptions.moonExpansion === true) {
      tags.push(Tags.MOON);
    }

    const options = tags.map((tag) => {
      return new SelectOption(tag, 'Choose', () => {
        this.card.cloneTag = tag;
        this.player.game.log('${0} turned the clone tag on ${1} into a ${2} tag',
          (b) => b.player(this.player).card(this.card).string(tag));
        if ([CardType.AUTOMATED, CardType.ACTIVE, CardType.EVENT, CardType.PRELUDE].includes(this.card.cardType)) {
          this.player.onCardPlayed(this.card as unknown as IProjectCard);
        }
        this.cb(tag);
        return undefined;
      });
    });
    const orOptions = new OrOptions(...options);
    orOptions.title = 'Select a new tag for this clone tag.';
    return orOptions;
  }
}
