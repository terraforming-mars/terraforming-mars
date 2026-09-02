import {expect} from 'chai';
import {SelectColony} from '../../src/server/inputs/SelectColony';
import {ColonyName} from '../../src/common/colonies/ColonyName';
import {IColony} from '../../src/server/colonies/IColony';
import {Luna} from '../../src/server/colonies/Luna';
import {Pluto} from '../../src/server/colonies/Pluto';

describe('SelectColony', () => {
  let luna: Luna;
  let pluto: Pluto;
  let selected: IColony | undefined;
  const cb = (colony: IColony) => {
    selected = colony;
    return undefined;
  };

  beforeEach(() => {
    luna = new Luna();
    pluto = new Pluto();
    selected = undefined;
  });

  it('Simple', () => {
    const selectColony = new SelectColony('', '', [luna, pluto]).andThen(cb);
    selectColony.process({type: 'colony', colonyName: ColonyName.LUNA});
    expect(selected!.name).eq(luna.name);
  });

  it('Cannot select unavailable colony', () => {
    const selectColony = new SelectColony('', '', [luna, pluto]).andThen(cb);
    selectColony.process({type: 'colony', colonyName: ColonyName.LUNA});
    expect(selected!.name).eq(luna.name);
    expect(() => selectColony.process({type: 'colony', colonyName: ColonyName.ENCELADUS}))
      .to.throw(Error, /Colony Enceladus not found/);
  });
});
