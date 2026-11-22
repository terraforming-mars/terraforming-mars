import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {CorporateCompetitionBorealis} from '@/server/automa/bonusCards/CorporateCompetitionBorealis';
import {competitionBot, fund} from './CorporateCompetitionBot';

describe('CorporateCompetitionBorealis', () => {
  it('advances the event track for Promoter on Vastitas Borealis', () => {
    const bot = competitionBot({boardName: BoardName.VASTITAS_BOREALIS_NOVA});
    fund(bot, 'Promoter');

    new CorporateCompetitionBorealis().resolve(bot.marsBot);

    expect(bot.calls).deep.eq([`advanceTrackOfTag(${Tag.EVENT})`, 'loseMc(5)']);
  });
});
