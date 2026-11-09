import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {SPLICE_MARSBOT_CORP} from '@/server/automa/corps/promo/SpliceMarsBot';
import {ArchaeBacteria} from '@/server/cards/base/ArchaeBacteria';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {Decomposers} from '@/server/cards/base/Decomposers';
import {OrOptions} from '@/server/inputs/OrOptions';
import {testGame} from '../../../TestGame';
import {runAllActions} from '../../../TestingUtils';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('SpliceMarsBot', () => {
  // C24: the Setup box (rulebook B p.1). A microbe card the player plays, a Prelude's too (rulebook B p.4)
  it('gains 8 M€ at setup, 4 M€ for its own microbe cards, and 2 M€ plus 2 M€ for the player for a microbe card that holds no microbes', () => {
    const [game, human] = testGame(1);
    const {marsBot, calls} = recordingMarsBot({game, humanPlayer: human});
    const effect = SPLICE_MARSBOT_CORP.effect!;

    SPLICE_MARSBOT_CORP.setup!(marsBot);
    effect.onProjectCardResolved!(marsBot, new Asteroid());
    effect.onProjectCardResolved!(marsBot, new ArchaeBacteria());
    effect.onHumanCardPlayed!(marsBot, new Asteroid());
    effect.onHumanCardPlayed!(marsBot, new ArchaeBacteria());

    expect(calls).deep.eq(['gainMc(8)', 'removeBonusCard(B03)', 'addProjectCardsToBonusDeck(microbe, 1)', 'gainMc(4)', 'gainMc(2)']);
    expect(human.stock.megacredits).eq(2);
  });

  it('lets the player add a microbe to a microbe card they played instead of gaining 2 M€', () => {
    const [game, human] = testGame(1);
    const {marsBot, calls} = recordingMarsBot({game, humanPlayer: human});
    const card = new Decomposers();

    SPLICE_MARSBOT_CORP.effect!.onHumanCardPlayed!(marsBot, card);
    runAllActions(game);
    const orOptions = cast(human.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    orOptions.options[0].cb();

    expect(calls).deep.eq(['gainMc(2)']);
    expect(card.resourceCount).eq(1);
    expect(human.stock.megacredits).eq(0);
  });
});
