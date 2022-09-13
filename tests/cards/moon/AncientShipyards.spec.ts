import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AncientShipyards} from '../../../src/server/cards/moon/AncientShipyards';
import {expect} from 'chai';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('AncientShipyards', () => {
  let game: Game;
  let bluePlayer: Player;
  let redPlayer: Player;
  let card: AncientShipyards;

  beforeEach(() => {
    bluePlayer = TestPlayer.BLUE.newPlayer();
    redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [bluePlayer, redPlayer], bluePlayer, testGameOptions({moonExpansion: true}));
    card = new AncientShipyards();
  });

  it('can play', () => {
    bluePlayer.cardsInHand = [card];
    bluePlayer.titanium = 2;
    bluePlayer.megaCredits = card.cost;
    expect(bluePlayer.getPlayableCards()).does.not.include(card);
    bluePlayer.titanium = 3;
    expect(bluePlayer.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    bluePlayer.titanium = 3;
    expect(bluePlayer.production.steel).eq(0);

    card.play(bluePlayer);

    expect(bluePlayer.titanium).eq(0);
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);
    bluePlayer.megaCredits = 0;
    redPlayer.megaCredits = 10;

    card.action(bluePlayer);
    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    // Steal from red.
    orOptions.options[0].cb();

    expect(bluePlayer.megaCredits).eq(8);
    expect(redPlayer.megaCredits).eq(2);
    expect(card.resourceCount).eq(1);
  });

  it('act solo', () => {
    redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [redPlayer], redPlayer, testGameOptions({moonExpansion: true}));

    expect(card.resourceCount).eq(0);
    redPlayer.megaCredits = 10;

    card.action(redPlayer);
    const options = game.deferredActions.pop()!.execute();
    expect(options).to.be.undefined;

    expect(redPlayer.megaCredits).eq(18);
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

