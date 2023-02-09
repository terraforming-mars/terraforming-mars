import {Game} from '../../../src/server/Game';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AncientShipyards} from '../../../src/server/cards/moon/AncientShipyards';
import {expect} from 'chai';
import {getTestPlayer, getTestPlayers, newTestGame} from '../../TestGame';

describe('AncientShipyards', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: AncientShipyards;

  beforeEach(() => {
    game = newTestGame(3, testGameOptions({moonExpansion: true}));
    [player, player2, player3] = getTestPlayers(game);
    card = new AncientShipyards();
    player.popSelectInitialCards();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 2;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 3;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);
    player.megaCredits = 0;
    player2.megaCredits = 10;
    player3.megaCredits = 7;

    card.action(player);
    runAllActions(game);
    expect(player.getWaitingFor()).is.undefined;

    expect(player.megaCredits).eq(4);
    expect(player2.megaCredits).eq(8);
    expect(player3.megaCredits).eq(5);
    expect(card.resourceCount).eq(1);
  });

  it('act solo', () => {
    game = newTestGame(1, testGameOptions({moonExpansion: true}));
    player = getTestPlayer(game, 0);
    player.popSelectInitialCards();

    expect(card.resourceCount).eq(0);
    player.megaCredits = 10;

    card.action(player);
    runAllActions(game);
    expect(player.getWaitingFor()).is.undefined;

    expect(player.megaCredits).eq(12);
    expect(card.resourceCount).eq(1);
  });

  it('victory points', () => {
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(-1);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(-2);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(-3);
  });
});

