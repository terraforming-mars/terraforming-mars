import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {CorporateCompetitionElysium} from '@/server/automa/bonusCards/CorporateCompetitionElysium';
import {competitionBot, fund} from './CorporateCompetitionBot';

describe('CorporateCompetitionElysium', () => {
  it('raises TR by 2 for Benefactor on Elysium', () => {
    const bot = competitionBot({boardName: BoardName.ELYSIUM});
    fund(bot, 'Benefactor');
    const tr = bot.botPlayer.terraformRating;

    new CorporateCompetitionElysium().resolve(bot.marsBot);

    expect(bot.botPlayer.terraformRating).eq(tr + 2);
    expect(bot.calls).deep.eq(['loseMc(5)']);
  });
});
