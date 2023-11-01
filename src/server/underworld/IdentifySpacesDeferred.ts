import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Space} from '../boards/Space';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class IdentifySpacesDeferred extends DeferredAction<Array<Space>> {
  private nth: number = 1;
  constructor(player: IPlayer, public count: number) {
    super(player, Priority.IDENTIFY_UNDERGROUND_RESOURCE);
  }

  private selectSpace(): PlayerInput {
    const prefix = 'Select space to identify';
    const title = prefix + (this.count > 1 ? ` (${this.nth} of ${this.count})` : '');
    const selectedSpaces: Array<Space> = [];

    return new SelectSpace(title,
      UnderworldExpansion.identifiableSpaces(this.player.game))
      .andThen((space) => {
        UnderworldExpansion.identify(this.player.game, space, this.player);
        selectedSpaces.push(space);
        this.nth++;
        if (this.nth <= this.count) {
          return this.selectSpace();
        }
        this.cb(selectedSpaces);
        return undefined;
      });
  }
  public execute(): PlayerInput | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.selectSpace();
  }
}
