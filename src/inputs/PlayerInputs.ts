import {SelectAmount} from './SelectAmount';
import {SelectCard} from './SelectCard';
import {SelectPlayer} from './SelectPlayer';
import {SelectOption} from './SelectOption';
import {SelectHowToPay} from './SelectHowToPay';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {SelectDelegate} from './SelectDelegate';
import {SelectColony} from './SelectColony';
import {SelectSpace} from './SelectSpace';

export type PlayerInputs = SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard>| SelectPlayer | SelectOption | SelectHowToPay | SelectDelegate | SelectColony | SelectColony | SelectSpace;

// From AndOptions
// OrOptions | SelectSpace | SelectCard<CorporationCard>
