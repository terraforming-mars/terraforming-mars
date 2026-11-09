import {expect} from 'chai';
import {PHARMACY_UNION_MARSBOT_CORP} from '@/server/automa/corps/promo/PharmacyUnionMarsBot';
import {ArchaeBacteria} from '@/server/cards/base/ArchaeBacteria';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {SearchForLife} from '@/server/cards/base/SearchForLife';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('PharmacyUnionMarsBot', () => {
  // C21: the Setup box (rulebook B p.1). A microbe card the player plays costs it 4 M€, a Prelude's too (rulebook B p.4)
  it('swaps Meteor Shower for a science card, raises its TR for science cards, and loses 4 M€ for the microbe cards the player plays', () => {
    const {marsBot, calls} = recordingMarsBot({megacredits: 6});
    const effect = PHARMACY_UNION_MARSBOT_CORP.effect!;

    PHARMACY_UNION_MARSBOT_CORP.setup!(marsBot);
    effect.onProjectCardResolved!(marsBot, new SearchForLife());
    effect.onProjectCardResolved!(marsBot, new Asteroid());
    expect(calls).deep.eq(['removeBonusCard(B01)', 'addProjectCardsToBonusDeck(science, 1)', 'raiseTR(1)']);

    for (const [card, megacredits] of [[new Asteroid(), 6], [new ArchaeBacteria(), 2], [new ArchaeBacteria(), 0]] as const) {
      effect.onHumanCardPlayed!(marsBot, card);
      expect(marsBot.megacredits).eq(megacredits);
    }
  });
});
