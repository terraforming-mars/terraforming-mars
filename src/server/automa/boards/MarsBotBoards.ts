import {BoardName} from '../../../common/boards/BoardName';
import {TrackDefinition} from '../../../common/automa/AutomaTypes';
import {THARSIS_MARSBOT_BOARD, THARSIS_MARSBOT_BOARD_WITH_VENUS} from './TharsisMarsBot';
import {HELLAS_MARSBOT_BOARD, HELLAS_MARSBOT_BOARD_WITH_VENUS} from './HellasMarsBot';
import {ELYSIUM_MARSBOT_BOARD, ELYSIUM_MARSBOT_BOARD_WITH_VENUS} from './ElysiumMarsBot';
import {UTOPIA_PLANITIA_MARSBOT_BOARD, UTOPIA_PLANITIA_MARSBOT_BOARD_WITH_VENUS} from './UtopiaPlanitiaMarsBot';
import {VASTITAS_BOREALIS_MARSBOT_BOARD, VASTITAS_BOREALIS_MARSBOT_BOARD_WITH_VENUS} from './VastitasBorealisMarsBot';
import {TERRA_CIMMERIA_MARSBOT_BOARD, TERRA_CIMMERIA_MARSBOT_BOARD_WITH_VENUS} from './TerraCimmeriaMarsBot';

type MarsBotBoardData = {
  readonly base: ReadonlyArray<TrackDefinition>;
  readonly withVenus: ReadonlyArray<TrackDefinition>;
};

/** The MarsBot board for each map, keyed by the map it ships with. */
export const MARSBOT_BOARDS: Partial<Record<BoardName, MarsBotBoardData>> = {
  [BoardName.THARSIS]: {base: THARSIS_MARSBOT_BOARD, withVenus: THARSIS_MARSBOT_BOARD_WITH_VENUS},
  [BoardName.HELLAS]: {base: HELLAS_MARSBOT_BOARD, withVenus: HELLAS_MARSBOT_BOARD_WITH_VENUS},
  [BoardName.ELYSIUM]: {base: ELYSIUM_MARSBOT_BOARD, withVenus: ELYSIUM_MARSBOT_BOARD_WITH_VENUS},
  [BoardName.UTOPIA_PLANITIA]: {base: UTOPIA_PLANITIA_MARSBOT_BOARD, withVenus: UTOPIA_PLANITIA_MARSBOT_BOARD_WITH_VENUS},
  [BoardName.VASTITAS_BOREALIS_NOVA]: {base: VASTITAS_BOREALIS_MARSBOT_BOARD, withVenus: VASTITAS_BOREALIS_MARSBOT_BOARD_WITH_VENUS},
  [BoardName.TERRA_CIMMERIA_NOVA]: {base: TERRA_CIMMERIA_MARSBOT_BOARD, withVenus: TERRA_CIMMERIA_MARSBOT_BOARD_WITH_VENUS},
};
