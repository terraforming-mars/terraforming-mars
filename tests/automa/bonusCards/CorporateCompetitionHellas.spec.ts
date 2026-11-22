import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {CorporateCompetitionHellas} from '@/server/automa/bonusCards/CorporateCompetitionHellas';
import {competitionBot, fund} from './CorporateCompetitionBot';

describe('CorporateCompetitionHellas', () => {
  it('advances the space track for Space Baron on Hellas', () => {
    const bot = competitionBot({boardName: BoardName.HELLAS});
    fund(bot, 'Space Baron');

    new CorporateCompetitionHellas().resolve(bot.marsBot);

    expect(bot.calls).deep.eq([`advanceTrackOfTag(${Tag.SPACE})`, 'loseMc(5)']);
  });
});
