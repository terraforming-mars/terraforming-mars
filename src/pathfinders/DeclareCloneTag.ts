import {Player} from '../Player';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {Tags} from '../cards/Tags';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ICloneTagCard} from '../cards/pathfinders/ICloneTagCard';
import {ICard} from '../cards/ICard';

export class DeclareCloneTag implements DeferredAction {
  public priority = Priority.DEFAULT;

  public constructor(
    public player: Player,
    public card: ICard & ICloneTagCard,
    public title: string,
    public cb: (tag: Tags) => void) {}

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
        this.cb(tag);
        return undefined;
      });
    });
    const orOptions = new OrOptions(...options);
    orOptions.title = 'Select a new tag for this clone tag.';
    return orOptions;
  }
}
