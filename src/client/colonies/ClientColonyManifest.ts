import {ColonyName} from '@/common/colonies/ColonyName';
import {ALL_COLONIES_TILES} from '@/colonies/ColonyManifest';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';
// @ts-ignore
import * as coloniesJson from '@/genfiles/colonies.json';
import {getPreferences} from '../utils/PreferencesManager';

const colonies: Map<ColonyName, IColonyMetadata> = new Map();
if (getPreferences().experimental_ui) {
  (coloniesJson as any as Array<IColonyMetadata>).forEach((colony) => {
    colonies.set(colony.name, colony);
  });
}

export function getColony(name: ColonyName): IColonyMetadata {
  if (getPreferences().experimental_ui) {
    const metadata = colonies.get(name);
    if (metadata === undefined) {
      throw new Error(`Unknown colony ${name}`);
    }
    return metadata;
  } else {
    const cf = ALL_COLONIES_TILES.find((cf) => cf.colonyName === name);
    if (cf === undefined) {
      throw new Error(`Unknown colony ${name}`);
    }
    return new cf.Factory().metadata;
  }
}
