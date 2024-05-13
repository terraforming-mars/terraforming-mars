import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {BonusId} from '../../common/turmoil/Types';
import {message} from '../logs/MessageBuilder';
import {Bonus} from '../turmoil/Bonus';
import {SelectPolicyBonus} from '../inputs/SelectPolicyBonus';

export class ChoosePolicyBonus extends DeferredAction {
  constructor(
    player: IPlayer,
    public bonuses: Array<Bonus>,
    public bonusCb: (bonusId: BonusId) => void,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute(): PlayerInput {
    /*
    const players = this.player.game.getPlayers();
    const _bonuses: Array<SelectOption> = this.bonuses.map((bonus) => {
      const description = message(
        bonus.description + ' (${0})',
        (b) => b.rawString(players.map((player) => player.name + ': ' + bonus.getScore(player)).join(' / ')),
      );

      return new SelectOption(description).andThen(() => {
        this.bonusCb(bonus.id);
        return undefined;
      });
    });
*/
    const orBonuses = new SelectPolicyBonus(
      message('Select a bonus'),
      'Select',
      this.bonuses.map((b) => b.id),
    );

    const cb = (_selected: BonusId) => {
      // this.player.game.startGeneration();
      return undefined;
    };
    return orBonuses.andThen(cb);
  }
}
