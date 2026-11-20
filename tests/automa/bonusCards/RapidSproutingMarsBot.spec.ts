import {expect} from 'chai';
import {RapidSproutingMarsBot} from '@/server/automa/bonusCards/RapidSproutingMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('RapidSproutingMarsBot', () => {
  for (const run of [
    {plants: 0, expected: {plants: 1, calls: []}},
    {plants: 1, expected: {plants: 0, calls: ['maybePlaceGreenery()']}},
  ] as const) {
    it('puts a plant on the corporation card, or spends it on a greenery: ' + JSON.stringify(run), () => {
      const {marsBot, calls, corpState} = recordingMarsBot();
      corpState.set('plantResources', run.plants);

      new RapidSproutingMarsBot().resolve(marsBot);

      expect({plants: corpState.get('plantResources'), calls}).deep.eq(run.expected);
    });
  }

  it('spends the plant when no greenery can be placed', () => {
    const {marsBot, corpState} = recordingMarsBot({maybePlaceGreenery: () => false});
    corpState.set('plantResources', 1);

    new RapidSproutingMarsBot().resolve(marsBot);

    expect(corpState.get('plantResources')).eq(0);
  });
});
