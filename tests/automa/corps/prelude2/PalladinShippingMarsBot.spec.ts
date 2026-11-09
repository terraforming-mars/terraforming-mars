import {expect} from 'chai';
import {PALLADIN_SHIPPING_MARSBOT_CORP} from '@/server/automa/corps/prelude2/PalladinShippingMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track indexes on the Tharsis board
const SPACE = 1;
const EVENT = 2;

describe('PalladinShippingMarsBot', () => {
  it('gains 5 M€ at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    PALLADIN_SHIPPING_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['gainMc(5)']);
  });

  // A white and a black cube on the card pay for one temperature step
  it('raises the temperature once a white and a black cube are on the card', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();
    const onCube = PALLADIN_SHIPPING_MARSBOT_CORP.effect!.onTrackCubeTrigger!;

    onCube(marsBot, SPACE, 3, 'white');
    onCube(marsBot, SPACE, 4, 'white');
    onCube(marsBot, EVENT, 3, 'black');

    expect(calls).deep.eq(['raiseTemperature(1)']);
    expect(corpState.get('whiteCubesOnCard')).eq(1);
    expect(corpState.get('blackCubesOnCard')).eq(0);
  });

  it('puts white cubes on the space track and black cubes on the same spaces of the event track', () => {
    expect(trackCubes(PALLADIN_SHIPPING_MARSBOT_CORP)).to.have.members([
      ...[3, 4, 6, 8, 10, 11].map((position) => `space white ${position}`),
      ...[3, 4, 6, 8, 10, 11].map((position) => `event black ${position}`),
    ]);
  });
});
