import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {SelectSpace} from './SelectSpace';
import {SelectHowToPay} from './SelectHowToPay';
import {SelectCard} from './SelectCard';
import {ICorporationCard} from '../cards/corporation/ICorporationCard';
import {SelectPlayer} from './SelectPlayer';
import {OrOptions} from './OrOptions';
import {SelectAmount} from './SelectAmount';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {SelectColony} from './SelectColony';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from '../Player';

export class AndOptions implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.AND_OPTIONS;
  public title = '';
  public buttonLabel: string = 'Save';
  public options: Array<PlayerInput>;
  constructor(public cb: () => PlayerInput | undefined, ...options: Array<OrOptions | SelectAmount | SelectPlayer | SelectHowToPay | SelectSpace | SelectColony | SelectCard<ICorporationCard> | SelectCard<ICard> | SelectCard<IProjectCard>>) {
    this.options = options;
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, this.options.length);
    for (let i = 0; i < input.length; i++) {
      player.runInput([input[i]], this.options[i]);
    }
    return this.cb();
  }
}
