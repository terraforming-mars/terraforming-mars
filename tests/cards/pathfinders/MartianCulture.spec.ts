import {expect} from 'chai';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('MartianCulture', function() {
  let card: MartianCulture;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new MartianCulture();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.playedCards.push(card);
  });

  it('can play', function() {
    player.megaCredits = card.cost;
    player.tagsForTest = {mars: 2};
    expect(player.canPlay(card)).is.true;

    player.tagsForTest = {mars: 1};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {mars: 1};
    player2.tagsForTest = {mars: 1};
    expect(player.canPlay(card)).is.true;

    player.tagsForTest = {mars: 0};
    player2.tagsForTest = {mars: 2};
    expect(player.canPlay(card)).is.true;
  });

  it('action', function() {
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).eq(1);
  });

  it('victoryPoints', function() {
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);

    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(1);

    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);

    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(2);
  });
});
