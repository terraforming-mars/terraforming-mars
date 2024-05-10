import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {BonusId} from '../../common/turmoil/Types';
import {message} from '../logs/MessageBuilder';
import {Bonus} from '../turmoil/Bonus';

export class ChoosePolicyBonus extends DeferredAction {
  constructor(
    player: IPlayer,
    public bonuses: Array<Bonus>,
    public bonusCb: (bonusId: BonusId) => void,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute(): PlayerInput {
    const players = this.player.game.getPlayers();
    const bonuses: Array<SelectOption> = this.bonuses.map((bonus) => {
      const description = message(
        bonus.description + ' (${0})',
        (b) => b.rawString(players.map((player) => player.name + ': ' + bonus.getScore(player)).join(' / ')),
      );

      return new SelectOption(description).andThen(() => {
        this.bonusCb(bonus.id);
        return undefined;
      });
    });

    const orBonuses = new OrOptions(...bonuses);
    // TODO(replace)
    orBonuses.title = message('Select a bonus');
    return orBonuses;
  }
}
