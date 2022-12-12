import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {Player} from "../../../src/server/Player";
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, forceGenerationEnd} from "../../TestingUtils";
import {Clarke} from "../../../src/server/cards/leaders/Clarke";


describe('Clarke', function() {
  let card: Clarke; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Clarke();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can only act once per game', function() {
    expect(card.canAct()).is.true;

    card.action(player);
    runAllActions(game);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });

  it('Takes action', function() {
    expect(card.action(player)).is.undefined;
    expect(player.plants).eq(4);
    expect(player.heat).eq(4);
  });
});
