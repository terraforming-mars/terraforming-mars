import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Priority} from '../deferredActions/Priority';
import {RunNTimes} from '../deferredActions/RunNTimes';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class IdentifySpacesDeferred extends RunNTimes<Space | UndergroundResourceToken> {
  constructor(player: IPlayer, count: number) {
    super(player, count, Priority.IDENTIFY_UNDERGROUND_RESOURCE);
  }

  protected run() {
    const title = 'Select space to identify' + this.titleSuffix();
    this.player.defer(() => {
      const identifiableSpaces = UnderworldExpansion.identifiableSpaces(this.player);
      if (identifiableSpaces.length === 0) {
        const token = UnderworldExpansion.drawExcavationToken(this.player.game);
        this.collection.push(token);
        return this.next();
      }
      return new SelectSpace(title, identifiableSpaces)
        .andThen((space) => {
          UnderworldExpansion.identify(this.player.game, space, this.player);
          this.collection.push(space);
          return this.next();
        });
    });
    return undefined;
  }
}
