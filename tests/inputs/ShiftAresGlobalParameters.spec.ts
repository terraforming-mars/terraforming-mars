import {expect} from 'chai';
import {testGame} from '../TestGame';
import {ShiftAresGlobalParameters} from '../../src/server/inputs/ShiftAresGlobalParameters';
import {TestPlayer} from '../TestPlayer';
import {AresGlobalParametersResponse} from '@/common/inputs/AresGlobalParametersResponse';
import {InputResponse} from '@/common/inputs/InputResponse';

describe('ShiftAresGlobalParameters', () => {
  let player: TestPlayer;
  let resp: AresGlobalParametersResponse | undefined = undefined;
  let shiftAresGlobalParameters: ShiftAresGlobalParameters;

  function cb(response: AresGlobalParametersResponse) {
    resp = response;
    return undefined;
  }

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    shiftAresGlobalParameters = new ShiftAresGlobalParameters().andThen(cb);
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

  it('fail, values that are not whole numbers', () => {
    resp = undefined;
    // A string would pass the range comparison and turn the shared thresholds into text
    for (const value of ['1', 0.5]) {
      expect(() =>
        shiftAresGlobalParameters.process({type: 'aresGlobalParameters', response: {
          lowOceanDelta: value as unknown as 1, highOceanDelta: 0, temperatureDelta: 0, oxygenDelta: 0,
        }}, player))
        .to.throw(/values out of range/);
    }
    expect(resp).is.undefined;
  });
});
