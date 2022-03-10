import {ColonyName} from '../common/colonies/ColonyName';
import {SerializedColony} from '../SerializedColony';
import {ALL_COLONIES_TILES} from './ColonyManifest';
import {IColony} from './IColony';

export class ColonyDeserializer {
  public static deserialize(serialized: SerializedColony | ColonyName): IColony | undefined {
    const name = typeof(serialized) === 'string' ? serialized : serialized.name;
    const factory = ALL_COLONIES_TILES.find((cf) => cf.colonyName === name);
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

  public static deserializeAndFilter(serialized: Array<SerializedColony | ColonyName>): Array<IColony> {
    const colonies: Array<IColony | undefined> = serialized.map((c) => this.deserialize(c)).filter((c) => c !== undefined);
    // as Array<Colony> is safe because filter removes the undefined colonies
    return colonies as Array<IColony>;
  }
}
