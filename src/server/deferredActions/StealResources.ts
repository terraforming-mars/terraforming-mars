import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';
import {LogHelper} from '../LogHelper';

export class StealResources extends DeferredAction {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public count: number = 1,
    public title: string | Message = message('Select player to steal up to ${0} ${1} from', (b) => b.number(count).string(resource)),
    public mandatory: boolean = false,
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  public static getCandidates(
    player: IPlayer,
    resource: Resource,
    count: number,
    mandatory: boolean = false): Array<IPlayer> {
    return player.opponents.filter((p) => {
      const minimum = mandatory ? count : 1;
      const amt = p.stock.get(resource);
      if (amt < minimum) {
        return false;
      }
      if (p.isProtected(resource)) {
        return false;
      }
      if (p.isHalfProtected(resource)) {
        return amt >= minimum * 2;
      }
      return true;
    });
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.stock.add(this.resource, this.count);
      LogHelper.logStealFromNeutralPlayer(this.player, this.resource, this.count);
      this.player.resolveInsuranceInSoloGame();
      return undefined;
    }

    const candidates = StealResources.getCandidates(this.player, this.resource, this.count, this.mandatory);

    if (candidates.length === 0) {
      return undefined;
    }

    const stealOptions = candidates.map((target) => {
      const unprotectedQty = Math.min(target.stock.get(this.resource), this.count);
      const qtyToSteal = target.lossAfterProtection(this.resource, unprotectedQty);

      return new SelectOption(
        message('Steal ${0} ${1} from ${2}', (b) => b.number(qtyToSteal).string(this.resource).player(target)),
        'Steal')
        .andThen(() => {
          target.attack(this.player, this.resource, qtyToSteal, {log: true, stealing: true});
          return undefined;
        });
    });

    if (!this.mandatory) {
      stealOptions.push(new SelectOption('Do not steal'));
    }
    return new OrOptions(...stealOptions);
  }
}
