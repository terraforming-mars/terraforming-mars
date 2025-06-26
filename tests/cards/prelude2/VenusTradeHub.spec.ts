
import {expect} from 'chai';
import {VenusTradeHub} from '../../../src/server/cards/prelude2/VenusTradeHub';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Luna} from '../../../src/server/colonies/Luna';
import {cast} from '../../TestingUtils';

describe('VenusTradeHub', () => {
  let card: VenusTradeHub;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusTradeHub();
    [game, player] = testGame(2, {coloniesExtension: true});
  });

  it('canPlay', () => {
    player.tagsForTest = {venus: 1};

    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {venus: 2};

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    cast(card.play(player), undefined);
  });

  it('effect', () => {
    player.playedCards.push(card);
    const luna = new Luna();
    game.colonies.push(luna);

    luna.trackPosition = 0; // 1 MC.
    luna.trade(player);

    expect(player.megaCredits).eq(4);
  });
});
