import {ColonyName} from '@/common/colonies/ColonyName';
import {ColonyMetadata} from '@/common/colonies/ColonyMetadata';
// @ts-ignore
import * as coloniesJson from '@/genfiles/colonies.json';

const colonies: Map<ColonyName, ColonyMetadata> = new Map();
(coloniesJson as any as Array<ColonyMetadata>).forEach((colony) => {
  colonies.set(colony.name, colony);
});

export function allColonyNames() {
  return colonies.keys();
}

export function getColony(name: ColonyName): ColonyMetadata {
  const metadata = colonies.get(name);
  if (metadata === undefined) {
    throw new Error(`Unknown colony ${name}`);
  }
  return metadata;
}
