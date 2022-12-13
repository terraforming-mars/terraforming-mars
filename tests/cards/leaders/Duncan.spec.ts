import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {Player} from "../../../src/server/Player";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';
import {Duncan} from "../../../src/server/cards/leaders/Duncan";


describe('Duncan', function() {
  let card: Duncan; let player: Player; let player2: Player;

  beforeEach(() => {
    card = new Duncan();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.playedCards.push(card);
  });

  it('Has 5 VP and 4 MC in gen 1', function() {
    card.action(player);
    expect(player.getVictoryPoints().total).eq(25);
    expect(player.megaCredits).eq(4);
  });

  it('Has -2 VP and 32 MC in gen 8', function() {
    for (let i = 0; i < 7; i++) {
      forceGenerationEnd(player.game);
    }

    player.megaCredits = 0;
    card.action(player);
    expect(player.getVictoryPoints().total).eq(18);
    expect(player.megaCredits).eq(32);

    // Run for a few more generations, leader VP should not change
    forceGenerationEnd(player.game);
    forceGenerationEnd(player.game);
    expect(player.getVictoryPoints().total).eq(18);
  });

  it('Does not affect VP if OPG action not used yet', function() {
    expect(player.getVictoryPoints().total).eq(20);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(player.game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
