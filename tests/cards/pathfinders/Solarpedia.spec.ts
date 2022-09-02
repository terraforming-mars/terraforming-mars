import {expect} from 'chai';
import {Solarpedia} from '../../../src/server/cards/pathfinders/Solarpedia';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../TestingUtils';

describe('Solarpedia', function() {
  let card: Solarpedia;
  let player: TestPlayer;
  let game: Game;
  let lunarObservationPost: LunarObservationPost;

  beforeEach(function() {
    card = new Solarpedia();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    lunarObservationPost = new LunarObservationPost();
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {earth: 0, venus: 1, jovian: 1, mars: 1};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {earth: 1, venus: 0, jovian: 1, mars: 1};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {earth: 1, venus: 1, jovian: 0, mars: 1};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {earth: 1, venus: 1, jovian: 1, mars: 0};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {earth: 1, venus: 1, jovian: 1, mars: 1};
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    const lunarObservationPost = new LunarObservationPost();
    player.playedCards = [lunarObservationPost];

    card.play(player);
    player.playedCards.push(card);

    testAddResourcesToCard();
  });

  it('act', function() {
    player.playedCards = [lunarObservationPost, card];

    card.action(player);

    testAddResourcesToCard();
  });

  it('getVictoryPoints', function() {
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 5;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 6;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 7;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 8;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 9;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 10;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 11;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 12;
    expect(card.getVictoryPoints()).eq(2);
  });

  function testAddResourcesToCard() {
    const selectCard = cast(game.deferredActions.pop()?.execute(), SelectCard);
    expect(selectCard.cards).eql([lunarObservationPost, card]);
    selectCard.cb([lunarObservationPost]);
    expect(lunarObservationPost.resourceCount).eq(2);

    selectCard.cb([card]);
    expect(card.resourceCount).eq(2);
  }
});
