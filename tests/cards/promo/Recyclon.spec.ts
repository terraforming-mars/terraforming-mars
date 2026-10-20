import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Recyclon} from '../../../src/server/cards/promo/Recyclon';
import {formatMessage, runAllActions} from '../../TestingUtils';
import {Mine} from '../../../src/server/cards/base/Mine';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../../src/common/utils/utils';

describe('Recyclon', () => {
  it('Should play', () => {
    const card = new Recyclon();
    const [game, player] = testGame(1);
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.production.steel).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });

  it('logs the added microbe', () => {
    const card = new Recyclon();
    const [game, player] = testGame(1);
    player.playedCards.push(card);

    game.gameLog.length = 0;
    card.onCardPlayed(player, new Mine());

    expect(game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 1 Microbe to Recyclon',
    ]);
  });

  it('logs the added microbe when choosing to add', () => {
    const card = new Recyclon();
    const [game, player] = testGame(1);
    player.playedCards.push(card);
    card.resourceCount = 2;

    const orOptions = cast(card.onCardPlayed(player, new Mine()), OrOptions);
    game.gameLog.length = 0;
    orOptions.options[1].cb();

    expect(game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 1 Microbe to Recyclon',
    ]);
  });

  it('logs the plant production when choosing to remove microbes', () => {
    const card = new Recyclon();
    const [game, player] = testGame(1);
    player.playedCards.push(card);
    card.resourceCount = 2;

    const orOptions = cast(card.onCardPlayed(player, new Mine()), OrOptions);
    game.gameLog.length = 0;
    orOptions.options[0].cb();

    expect(player.production.plants).eq(1);
    expect(game.gameLog.map(formatMessage).filter((message) => message.includes('production'))).deep.eq([
      'blue gained 1 plant production because of Recyclon',
    ]);
  });
});
