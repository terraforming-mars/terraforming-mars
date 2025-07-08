import {inplaceRemove} from '../../common/utils/utils';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Priority} from '../deferredActions/Priority';
import {RunNTimes} from '../deferredActions/RunNTimes';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class ClaimSpacesDeferred extends RunNTimes<void> {
  private spaces: Array<Space>;

  constructor(
    player: IPlayer,
    count: number,
    spaces: ReadonlyArray<Space>,
  ) {
    super(player, count, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
    this.spaces = spaces.slice();
  }

  protected run() {
    const title = 'Select space to claim' + this.titleSuffix();
    this.player.defer(() => {
      // slicing a copy because the spaces array is mutated between calls.
      return new SelectSpace(title, this.spaces.slice())
        .andThen((space) => {
          UnderworldExpansion.claim(this.player, space);
          if (this.spaces) {
            inplaceRemove(this.spaces, space);
          }
          this.next();
          return undefined;
        });
    });
    return undefined;
  }
}
