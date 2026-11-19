import {expect} from 'chai';
import {PalladinShippingMarsBot} from '@/server/automa/corps/prelude2/PalladinShippingMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('PalladinShippingMarsBot', () => {
  it('gains 5 M€ at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new PalladinShippingMarsBot().setup(marsBot);

    expect(calls).deep.eq(['gainMc(5)']);
  });

  // A white and a black cube on the card pay for one temperature step
  it('raises the temperature once a white and a black cube are on the card', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();
    const corp = new PalladinShippingMarsBot();

    corp.onTrackCubeTrigger(marsBot, TRACK.space, 3, 'white');
    corp.onTrackCubeTrigger(marsBot, TRACK.space, 4, 'white');
    corp.onTrackCubeTrigger(marsBot, TRACK.event, 3, 'black');

    expect(calls).deep.eq(['raiseTemperature(1)']);
    expect(corpState.get('whiteCubesOnCard')).eq(1);
    expect(corpState.get('blackCubesOnCard')).eq(0);
  });

  it('puts white cubes on the space track and black cubes on the same spaces of the event track', () => {
    expect(trackCubes(new PalladinShippingMarsBot())).to.have.members([
      ...[3, 4, 6, 8, 10, 11].map((position) => `space white ${position}`),
      ...[3, 4, 6, 8, 10, 11].map((position) => `event black ${position}`),
    ]);
  });
});
