import {GameOptionsModel} from './GameOptionsModel';
import {ColonyModel} from '../common/models/ColonyModel';
import {Color} from '../common/Color';
import {TurmoilModel} from './TurmoilModel';
import {ClaimedMilestoneModel} from '../common/models/ClaimedMilestoneModel';
import {FundedAwardModel} from '../common/models/FundedAwardModel';
import {Phase} from '../common/Phase';
import {IAresData} from '../common/ares/IAresData';
import {SpaceModel} from '../common/models/SpaceModel';
import {MoonModel} from '../common/models/MoonModel';
import {PathfindersModel} from './PathfindersModel';

// Common data about a game not assocaited with a player (eg the temperature.)
export interface GameModel {
  aresData: IAresData | undefined;
  awards: Array<FundedAwardModel>;
  colonies: Array<ColonyModel>;
  deckSize: number;
  gameAge: number;
  gameOptions: GameOptionsModel;
  generation: number;
  isSoloModeWin: boolean;
  lastSoloGeneration: number,
  milestones: Array<ClaimedMilestoneModel>;
  moon: MoonModel | undefined;
  oceans: number;
  oxygenLevel: number;
  passedPlayers: Array<Color>;
  pathfinders: PathfindersModel | undefined;
  phase: Phase;
  spaces: Array<SpaceModel>;
  spectatorId?: string;
  step: number;
  temperature: number;
  isTerraformed: boolean;
  turmoil: TurmoilModel | undefined;
  undoCount: number;
  venusScaleLevel: number;
}
