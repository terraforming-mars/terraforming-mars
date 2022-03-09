import {ColonyName} from '../common/colonies/ColonyName';
import {SerializedColony} from '../SerializedColony';
import {Colony} from './Colony';
import {ALL_ALL_COLONIES_TILES} from './ColonyManifest';

export class ColonyDeserializer {
  public static deserialize(serialized: SerializedColony | ColonyName): Colony | undefined {
    const name = typeof(serialized) === 'string' ? serialized : serialized.name;
    const factory = ALL_ALL_COLONIES_TILES.find((cf) => cf.colonyName === name);
    if (factory === undefined) {
      console.warn(`colony ${name} not found`);
      return undefined;
    }

    const colony = new factory.Factory();
    if (typeof(serialized) !== 'string') {
      colony.colonies = serialized.colonies;
      colony.isActive = serialized.isActive;
      colony.trackPosition = serialized.trackPosition;
      colony.visitor = serialized.visitor;
    }
    return colony;
  }

  public static deserializeAndFilter(serialized: Array<SerializedColony | ColonyName>): Array<Colony> {
    const colonies: Array<Colony | undefined> = serialized.map((c) => this.deserialize(c)).filter((c) => c !== undefined);
    // as Array<Colony> is safe because filter removes the undefined colonies
    return colonies as Array<Colony>;
  }
}
