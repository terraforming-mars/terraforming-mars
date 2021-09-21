import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {AncientShipyards} from '../../../src/cards/moon/AncientShipyards';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {OrOptions} from '../../../src/inputs/OrOptions';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('AncientShipyards', () => {
  let game: Game;
  let bluePlayer: Player;
  let redPlayer: Player;
  let card: AncientShipyards;

  beforeEach(() => {
    bluePlayer = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [bluePlayer, redPlayer], bluePlayer, MOON_OPTIONS);
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
    expect(bluePlayer.getProduction(Resources.STEEL)).eq(0);

    card.play(bluePlayer);

    expect(bluePlayer.titanium).eq(0);
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);
    bluePlayer.megaCredits = 0;
    redPlayer.megaCredits = 10;

    card.action(bluePlayer);
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    // Steal from red.
    orOptions.options[0].cb();

    expect(bluePlayer.megaCredits).eq(8);
    expect(redPlayer.megaCredits).eq(2);
    expect(card.resourceCount).eq(1);
  });

  it('act solo', () => {
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [redPlayer], redPlayer, MOON_OPTIONS);

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
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(-1);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(-1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(-2);
  });
});

