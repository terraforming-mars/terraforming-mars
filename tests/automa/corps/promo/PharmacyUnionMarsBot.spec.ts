import {expect} from 'chai';
import {PharmacyUnionMarsBot} from '@/server/automa/corps/promo/PharmacyUnionMarsBot';
import {ArchaeBacteria} from '@/server/cards/base/ArchaeBacteria';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {SearchForLife} from '@/server/cards/base/SearchForLife';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('PharmacyUnionMarsBot', () => {
  // The Setup box (rulebook B p.1). A microbe card the player plays costs it 4 M€, Preludes included (rulebook B p.4)
  it('swaps Meteor Shower for a science card, raises its TR for science cards, and loses 4 M€ for the microbe cards the player plays', () => {
    const {marsBot, calls} = recordingMarsBot({megacredits: 6});
    const corp = new PharmacyUnionMarsBot();

    new PharmacyUnionMarsBot().setup(marsBot);
    corp.onProjectCardResolved(marsBot, new SearchForLife());
    corp.onProjectCardResolved(marsBot, new Asteroid());
    expect(calls).deep.eq(['removeBonusCard(Meteor Shower)', 'addProjectCardsToBonusDeck(science, 1)', 'raiseTR(1)']);

    for (const [card, megacredits] of [[new Asteroid(), 6], [new ArchaeBacteria(), 2], [new ArchaeBacteria(), 0]] as const) {
      corp.onHumanCardPlayed(marsBot, card);
      expect(marsBot.megacredits).eq(megacredits);
    }
  });
});
