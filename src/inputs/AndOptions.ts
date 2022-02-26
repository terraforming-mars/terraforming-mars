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

export class AndOptions implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.AND_OPTIONS;
  public title = '';
  public buttonLabel: string = 'Save';
  public options: Array<PlayerInput>;
  constructor(public cb: () => PlayerInput | undefined, ...options: Array<OrOptions | SelectAmount | SelectPlayer | SelectHowToPay | SelectSpace | SelectColony | SelectCard<ICorporationCard> | SelectCard<ICard> | SelectCard<IProjectCard>>) {
    this.options = options;
  }
}
