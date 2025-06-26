import {expect} from 'chai';
import {TradeEmbargo} from '../../../src/server/cards/starwars/TradeEmbargo';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';

describe('TradeEmbargo', () => {
  let card: TradeEmbargo;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TradeEmbargo();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
  });

  it('play', () => {
    expect(player.colonies.canTrade()).is.true;
    expect(player2.colonies.canTrade()).is.true;

    card.play(player);

    expect(player.colonies.canTrade()).is.false;
    expect(player2.colonies.canTrade()).is.false;

    forceGenerationEnd(game);

    expect(player.colonies.canTrade()).is.true;
    expect(player2.colonies.canTrade()).is.true;
  });
});
