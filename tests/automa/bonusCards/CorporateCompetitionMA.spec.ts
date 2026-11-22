import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {awardManifest} from '@/server/awards/Awards';
import {CorporateCompetitionMA} from '@/server/automa/bonusCards/CorporateCompetitionMA';
import {cardsFromJSON} from '@/server/createCard';
import {competitionBot, fund} from './CorporateCompetitionBot';

describe('CorporateCompetitionMA', () => {
  it('plays a card without tags and gains 5 M€ for Administrator', () => {
    const bot = competitionBot({modularMA: true});
    bot.game.awards = [awardManifest.createOrThrow('Administrator')];
    fund(bot, 'Administrator');
    bot.game.projectDeck.drawPile.push(...cardsFromJSON([CardName.ICE_CAP_MELTING, CardName.MICRO_MILLS]).toReversed());

    new CorporateCompetitionMA().resolve(bot.marsBot);

    expect(bot.calls).deep.eq([`resolveProjectCard(${CardName.MICRO_MILLS})`, 'gainMc(5)', 'loseMc(5)']);
  });
});
