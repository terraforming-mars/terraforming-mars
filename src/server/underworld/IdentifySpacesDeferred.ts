import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Space} from '../boards/Space';
import {Priority} from '../deferredActions/Priority';
import {RunNTimes} from '../deferredActions/RunNTimes';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class IdentifySpacesDeferred extends RunNTimes<Space> {
  constructor(player: IPlayer, count: number) {
    super(player, count, Priority.IDENTIFY_UNDERGROUND_RESOURCE);
  }

  protected run(): PlayerInput | undefined {
    const title = 'Select space to identify' + this.titleSuffix();

    const identifiableSpaces = UnderworldExpansion.identifiableSpaces(this.player);
    if (identifiableSpaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(title, identifiableSpaces)
      .andThen((space) => {
        UnderworldExpansion.identify(this.player.game, space, this.player);
        this.collection.push(space);
        return this.next();
      });
  }
}
