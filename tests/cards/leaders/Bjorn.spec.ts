import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {Player} from "../../../src/server/Player";
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd} from "../../TestingUtils";
import {Bjorn} from "../../../src/server/cards/leaders/Bjorn";

describe('Bjorn', function() {
  let card: Bjorn; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Bjorn();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Takes OPG action', function() {
    game.generation = 9;
    player2.megaCredits = 4;

    card.action(player);
    expect(player.megaCredits).eq(4);
    expect(player2.megaCredits).eq(0);
    expect(card.isDisabled).is.true;
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
