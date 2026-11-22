import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {CorporateCompetitionUtopia} from '@/server/automa/bonusCards/CorporateCompetitionUtopia';
import {competitionBot, fund} from './CorporateCompetitionBot';

describe('CorporateCompetitionUtopia', () => {
  it('advances the Earth track for Investor on Utopia Planitia', () => {
    const bot = competitionBot({boardName: BoardName.UTOPIA_PLANITIA});
    fund(bot, 'Investor');

    new CorporateCompetitionUtopia().resolve(bot.marsBot);

    expect(bot.calls).deep.eq([`advanceTrackOfTag(${Tag.EARTH})`, 'loseMc(5)']);
  });
});
