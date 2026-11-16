import {BoardName} from '../../../common/boards/BoardName';
import {TrackDefinition} from '../../../common/automa/AutomaTypes';
import {THARSIS_MARSBOT_BOARD} from './TharsisMarsBot';
import {HELLAS_MARSBOT_BOARD} from './HellasMarsBot';
import {ELYSIUM_MARSBOT_BOARD} from './ElysiumMarsBot';
import {UTOPIA_PLANITIA_MARSBOT_BOARD} from './UtopiaPlanitiaMarsBot';
import {VASTITAS_BOREALIS_MARSBOT_BOARD} from './VastitasBorealisMarsBot';
import {TERRA_CIMMERIA_MARSBOT_BOARD} from './TerraCimmeriaMarsBot';

/** The MarsBot board for each map, keyed by the map it ships with. */
export const MARSBOT_BOARDS: Partial<Record<BoardName, ReadonlyArray<TrackDefinition>>> = {
  [BoardName.THARSIS]: THARSIS_MARSBOT_BOARD,
  [BoardName.HELLAS]: HELLAS_MARSBOT_BOARD,
  [BoardName.ELYSIUM]: ELYSIUM_MARSBOT_BOARD,
  [BoardName.UTOPIA_PLANITIA]: UTOPIA_PLANITIA_MARSBOT_BOARD,
  [BoardName.VASTITAS_BOREALIS_NOVA]: VASTITAS_BOREALIS_MARSBOT_BOARD,
  [BoardName.TERRA_CIMMERIA_NOVA]: TERRA_CIMMERIA_MARSBOT_BOARD,
};
