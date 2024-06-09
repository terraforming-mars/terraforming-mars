import {IPlayer} from '../IPlayer';
import {Priority} from '../deferredActions/Priority';
import {RunNTimes} from '../deferredActions/RunNTimes';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';

export class ExcavateSpacesDeferred extends RunNTimes<void> {
  constructor(
    player: IPlayer,
    count: number,
    private ignorePlacementRestrictions: boolean = false,
  ) {
    super(player, count, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
  }

  protected run() {
    const title = 'Select space to excavate' + this.titleSuffix();
    this.player.defer(() => {
      return new SelectSpace(title,
        UnderworldExpansion.excavatableSpaces(this.player, this.ignorePlacementRestrictions))
        .andThen((space) => {
          UnderworldExpansion.excavate(this.player, space);
          this.next();
          return undefined;
        });
    });
    return undefined;
  }
}
