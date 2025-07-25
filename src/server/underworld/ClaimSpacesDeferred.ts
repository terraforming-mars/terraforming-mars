import {ClaimedToken} from '../../common/underworld/UnderworldPlayerData';
import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';
import {inplaceRemove, partition} from '../../common/utils/utils';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';
import {Priority} from '../deferredActions/Priority';
import {RunNTimes} from '../deferredActions/RunNTimes';
import {OrOptions} from '../inputs/OrOptions';
import {SelectClaimedUndergroundToken} from '../inputs/SelectClaimedUndergroundToken';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class ClaimSpacesDeferred extends RunNTimes<void> {
  private spaces: Array<Space | UndergroundResourceToken>;

  constructor(
    player: IPlayer,
    count: number,
    spaces: ReadonlyArray<Space | UndergroundResourceToken>,
  ) {
    super(player, count, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
    this.spaces = spaces.slice();
  }

  protected run() {
    const title = 'Select space to claim' + this.titleSuffix();
    this.player.defer(() => {
      // slicing a copy because the spaces array is mutated between calls.
      const p = partition(this.spaces, (s) => typeof s === 'object');
      const spaces = p[0] as Array<Space>;
      const tokens: Array<ClaimedToken> = (p[1] as Array<UndergroundResourceToken>).map((t) => {
        return {
          token: t,
          shelter: false,
          active: false,
        };
      });

      const selectSpace = new SelectSpace(title, spaces)
        .andThen((space) => {
          UnderworldExpansion.claim(this.player, space);
          if (this.spaces) {
            inplaceRemove(this.spaces, space);
          }
          this.next();
          return undefined;
        });
      const selectToken = new SelectClaimedUndergroundToken(tokens, 1, 1).andThen(([idx]) => {
        const token = tokens[idx];
        if (this.spaces) {
          inplaceRemove(this.spaces, token.token);
        }
        UnderworldExpansion.claimToken(this.player, token.token, /* isExavate= */ true, /* space= */ undefined);
        return this.next();
      }).setTitle('Select underground token to claim');

      if (spaces.length > 0 && tokens.length > 0) {
        return new OrOptions(selectSpace, selectToken);
      } else if (spaces.length > 0) {
        return selectSpace;
      } else if (tokens.length > 0) {
        return selectToken;
      } else {
        throw new Error('No spaces or tokens to claim');
      }
    });
    return undefined;
  }
}
