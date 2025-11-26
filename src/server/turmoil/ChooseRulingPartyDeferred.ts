import {IPlayer} from '@/server/IPlayer';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {OrOptions} from '@/server/inputs/OrOptions';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {PoliticalAgendas} from '@/server/turmoil/PoliticalAgendas';
import {IParty} from '@/server/turmoil/parties/IParty';
import {SelectOption} from '@/server/inputs/SelectOption';

export class ChooseRulingPartyDeferred extends DeferredAction<IParty> {
  private turmoil: Turmoil;
  constructor(player: IPlayer, turmoil: Turmoil) {
    super(player);
    this.turmoil = turmoil;
  }

  public execute() {
    // Interesting that this doesn't use SelectParty. Perhaps that's the right choice.
    const setRulingParty = new OrOptions().setTitle('Select new ruling party');
    setRulingParty.options = this.turmoil.parties.map((p: IParty) => new SelectOption(p.name).andThen(() => {
      this.turmoil.rulingPolicy().onPolicyEnd?.(this.player.game);
      this.turmoil.rulingParty = p;
      PoliticalAgendas.setNextAgenda(this.turmoil, this.player.game);
      this.cb(p);
      return undefined;
    }));
    return setRulingParty;
  }
}
