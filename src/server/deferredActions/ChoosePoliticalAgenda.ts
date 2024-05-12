import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {IParty} from '../turmoil/parties/IParty';
import {BonusId, PolicyId} from '../../common/turmoil/Types';
import {policyDescription} from '../turmoil/Policy';
import {message} from '../logs/MessageBuilder';

export class ChoosePoliticalAgenda extends DeferredAction {
  constructor(
    player: IPlayer,
    public party: IParty,
    public bonusCb: (bonusId: BonusId) => void,
    public policyCb: (policyId: PolicyId) => void,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute(): PlayerInput {
    const players = this.player.game.getPlayers();
    const bonuses: Array<SelectOption> = this.party.bonuses.map((bonus) => {
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
    orBonuses.title = message('Select a ${0} bonus', (b) => b.party(this.party));

    const policies = this.party.policies.map((policy) => {
      return new SelectOption(policyDescription(policy, this.player),
        'Select')
        .andThen(() => {
          this.policyCb(policy.id);
          return undefined;
        });
    });
    const orPolicies = new OrOptions(...policies);
    orPolicies.title = message('Select a ${0} policy', (b) => b.party(this.party));

    return new OrOptions(orBonuses, orPolicies);
  }
}
