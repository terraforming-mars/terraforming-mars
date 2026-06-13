// Stub — real implementation in PR 3
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';

export class MarsBotTilePlacer {
  constructor(_game: IGame, _marsBot: IPlayer, _humanPlayer: IPlayer) {}
  findGreenerySpace(): Space | undefined { return undefined; }
  findCitySpace(): Space | undefined { return undefined; }
  findExpediteConstructionCitySpace(): Space | undefined { return undefined; }
  findOceanSpace(): Space | undefined { return undefined; }
  findNeuralInstanceSpace(): Space | undefined { return undefined; }
  getPlacementBonusMC(_space: Space): number { return 0; }
  getOceanAdjacencyMC(_space: Space): number { return 0; }
  getTotalPlacementMC(_space: Space): number { return 0; }
}
