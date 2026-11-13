import {expect} from 'chai';
import {SPIRE_MARSBOT_CORP} from '@/server/automa/corps/prelude2/SpireMarsBot';
import {ArtificialLake} from '@/server/cards/base/ArtificialLake';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('SpireMarsBot', () => {
  it('collects a science resource for a card with 2 tags, none for 1, and spends 10 on a city and 1 TR', () => {
    const {marsBot, calls, corpState} = recordingMarsBot();
    const onCard = SPIRE_MARSBOT_CORP.effect!.onProjectCardResolved!;
    corpState.set('scienceResources', 9);

    onCard(marsBot, new ArtificialLake());
    expect(corpState.get('scienceResources')).eq(9);
    onCard(marsBot, new Asteroid());
    SPIRE_MARSBOT_CORP.beforeActionPhase!(marsBot);

    expect(corpState.get('scienceResources')).eq(0);
    expect(calls).deep.eq(['placeCity()', 'raiseTR(1)']);
  });
});
