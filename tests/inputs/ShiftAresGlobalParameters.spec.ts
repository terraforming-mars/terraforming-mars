import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../TestGame';
import {ShiftAresGlobalParameters} from '../../src/server/inputs/ShiftAresGlobalParameters';
import {TestPlayer} from '../TestPlayer';
import {AresGlobalParametersResponse} from '@/common/inputs/AresGlobalParametersResponse';
import {InputResponse} from '@/common/inputs/InputResponse';

// TODO(kberg): Add preludes
describe('ShiftAresGlobalParameters', () => {
  let player: TestPlayer;
  let resp: AresGlobalParametersResponse | undefined = undefined;
  let shiftAresGlobalParameters: ShiftAresGlobalParameters;

  function cb(response: AresGlobalParametersResponse) {
    resp = response;
    return undefined;
  }

  beforeEach(() => {
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
    shiftAresGlobalParameters = new ShiftAresGlobalParameters(player, cb);
  });

  it('fail, no fields', () => {
    expect(() =>
      shiftAresGlobalParameters.process({type: 'aresGlobalParameters', response: {}} as InputResponse, player))
      .to.throw(/Not a valid ShiftAresGlobalParametersResponse/);
  });

  it('fail, invalid fields', () => {
    expect(() =>
      shiftAresGlobalParameters.process({
        type: 'aresGlobalParameters',
        response: {
          a: 1,
          b: 2,
        },
      } as unknown as InputResponse, player))
      .to.throw(/Not a valid ShiftAresGlobalParametersResponse/);
  });

  it('fail, invalid values', () => {
    expect(() =>
      shiftAresGlobalParameters.process({
        type: 'aresGlobalParameters',
        response: {
          lowOceanDelta: 3,
          highOceanDelta: 1,
          oxygenDelta: 1,
          temperatureDelta: 1,
        },
      } as unknown as InputResponse, player))
      .to.throw(/values out of range/);
  });

  it('success', () => {
    shiftAresGlobalParameters.process({
      type: 'aresGlobalParameters',
      response: {
        lowOceanDelta: 1,
        highOceanDelta: 0,
        oxygenDelta: -1,
        temperatureDelta: 1,
      },
    }, player); 1;
    expect(resp).deep.eq({
      lowOceanDelta: 1,
      highOceanDelta: 0,
      oxygenDelta: -1,
      temperatureDelta: 1,
    });
  });
});
