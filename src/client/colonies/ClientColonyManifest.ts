import {ColonyName} from '@/common/colonies/ColonyName';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';
// @ts-ignore
import * as coloniesJson from '@/genfiles/colonies.json';

const colonies: Map<ColonyName, IColonyMetadata> = new Map();
(coloniesJson as any as Array<IColonyMetadata>).forEach((colony) => {
  colonies.set(colony.name, colony);
});

export function getColony(name: ColonyName): IColonyMetadata {
  const metadata = colonies.get(name);
  if (metadata === undefined) {
    throw new Error(`Unknown colony ${name}`);
  }
  return metadata;
}
