import {expect} from 'chai';
import {SelectProductionToLose} from '../../src/server/inputs/SelectProductionToLose';
import {Units} from '../../src/common/Units';
import {TestPlayer} from '../TestPlayer';

describe('SelectProductionToLose', () => {
  let player: TestPlayer;
  let selectProductionToLose: SelectProductionToLose;
  let selected: Units | undefined = undefined;
  const cb = (units: Units) => {
    selected = units;
    return undefined;
  };

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    player.production.adjust(Units.every(1));
    selectProductionToLose = new SelectProductionToLose('', 2, player).andThen(cb);
  });

  it('Simple', () => {
    selectProductionToLose.process({type: 'productionToLose', units: Units.of({megacredits: 2})}, player);
    expect(selected).deep.eq(Units.of({megacredits: 2}));
  });

  for (const run of [
    {units: Units.EMPTY, expected: /Select 2 steps of production/},
    {units: Units.of({megacredits: 1}), expected: /Select 2 steps of production/},
    {units: Units.of({megacredits: 3}), expected: /Select 2 steps of production/},
    {units: Units.of({titanium: 2}), expected: /You do not have those units/},
    {units: Units.of({titanium: -1}), expected: /All units must be zero or positive integers/},
    {units: {...Units.EMPTY, x: 2}, expected: /Select 2 steps of production/},
    {units: {...Units.EMPTY, steel: undefined}, expected: /not a units object/},
    {units: Units.of({megacredits: 1.5, heat: 0.5}), expected: /All units must be zero or positive integers/},
  ] as const) {
    it('Failure case ' + JSON.stringify(run), () => {
      const units = run.units as unknown as Units;
      expect(() => selectProductionToLose.process({type: 'productionToLose', units: units}, player))
        .to.throw(run.expected);
    });
  }
});
