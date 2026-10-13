import {expect} from 'chai';
import {SelectProductionToLose} from '../../src/server/inputs/SelectProductionToLose';
import {Units} from '../../src/common/Units';
import {TestPlayer} from '../TestPlayer';

describe('SelectProductionToLose', () => {
  let player: TestPlayer;
  let selected: Units | undefined = undefined;
  const cb = (units: Units) => {
    selected = units;
    return undefined;
  };

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Simple', () => {
    const selectProductionToLose = new SelectProductionToLose('', 2, player).andThen(cb);

    selectProductionToLose.process({type: 'productionToLose', units: Units.of({megacredits: 2})}, player);
    expect(selected).deep.eq(Units.of({megacredits: 2}));
    expect(() => selectProductionToLose.process({type: 'productionToLose', units: Units.EMPTY}, player))
      .to.throw(/Select 2 steps of production/);
    expect(() => selectProductionToLose.process({type: 'productionToLose', units: Units.of({megacredits: 1})}, player))
      .to.throw(/Select 2 steps of production/);
    expect(() => selectProductionToLose.process({type: 'productionToLose', units: Units.of({megacredits: 3})}, player))
      .to.throw(/Select 2 steps of production/);
    expect(() => selectProductionToLose.process({type: 'productionToLose', units: Units.of({titanium: 1})}, player))
      .to.throw(/You do not have those units/);
  });

  it('Rejects extra fields and fractions', () => {
    const selectProductionToLose = new SelectProductionToLose('', 2, player).andThen(cb);
    selected = undefined;
    // An extra field would count towards the sum without costing any production
    const withExtraField = {...Units.EMPTY, x: 2} as unknown as Units;
    expect(() => selectProductionToLose.process({type: 'productionToLose', units: withExtraField}, player))
      .to.throw(/not a units object/);
    expect(() => selectProductionToLose.process({type: 'productionToLose', units: Units.of({megacredits: 1.5, heat: 0.5})}, player))
      .to.throw(/not a units object/);
    expect(selected).is.undefined;
  });
});
