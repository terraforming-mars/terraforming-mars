import {SelectProductionToLose} from '../inputs/SelectProductionToLose';
import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Units} from '../../common/Units';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

export class SelectProductionToLoseDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
    private unitsToLose: number,
    private title: string | Message = message('Choose ${0} unit(s) of production to lose', (b) => b.number(unitsToLose)),
    private pairs: number = 0,
  ) {
    super(player, Priority.LOSE_RESOURCE_OR_PRODUCTION);
  }

  public execute() {
    return new SelectProductionToLose(
      this.title,
      this.unitsToLose,
      this.player,
      undefined,
      this.pairs)
      .andThen((production) => {
        this.player.production.adjust(Units.negative(production), {log: true});
        return undefined;
      });
  }
}
