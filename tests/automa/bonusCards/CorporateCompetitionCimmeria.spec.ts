import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {CardName} from '@/common/cards/CardName';
import {CorporateCompetitionCimmeria} from '@/server/automa/bonusCards/CorporateCompetitionCimmeria';
import {cardsFromJSON} from '@/server/createCard';
import {competitionBot, fund} from './CorporateCompetitionBot';

describe('CorporateCompetitionCimmeria', () => {
  it('helps with Forecaster on Terra Cimmeria for free', () => {
    const bot = competitionBot({boardName: BoardName.TERRA_CIMMERIA_NOVA});
    fund(bot, 'Forecaster');
    bot.game.projectDeck.drawPile.push(...cardsFromJSON([CardName.MINE, CardName.ALGAE]).toReversed());

    new CorporateCompetitionCimmeria().resolve(bot.marsBot);

    expect(bot.calls).deep.eq([`resolveProjectCard(${CardName.ALGAE})`, 'gainMc(0)']);
  });
});
