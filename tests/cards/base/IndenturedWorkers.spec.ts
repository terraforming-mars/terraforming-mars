import {expect} from 'chai';
import {IndenturedWorkers} from '../../../src/server/cards/base/IndenturedWorkers';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('IndenturedWorkers', function() {
  let card: IndenturedWorkers;
  let player: TestPlayer;

  beforeEach(() => {
    card = new IndenturedWorkers();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player, TestPlayer.RED.newPlayer()], player);
  });

  it('play', () => {
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(-1);
    expect(card.getCardDiscount(player)).to.eq(0);
  });

  it('Should apply card discount until next card played', () => {
    player.playCard(card);
    expect(card.getCardDiscount(player)).to.eq(8);

    player.playCard(new MicroMills());

    expect(card.getCardDiscount(player)).to.eq(0);
  });

  it('Change in generation disables Indentured Workers', () => {
    player.playCard(card);
    expect(card.getCardDiscount(player)).to.eq(8);

    player.pass();

    expect(card.getCardDiscount(player)).to.eq(0);
  });
});
