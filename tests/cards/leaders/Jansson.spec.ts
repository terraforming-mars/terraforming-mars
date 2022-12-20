import {expect} from "chai";
import {Jansson} from "../../../src/server/cards/leaders/Jansson";
import {Game} from "../../../src/server/Game";
import {forceGenerationEnd, addGreenery} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';


describe('Jansson', function() {
  let card: Jansson;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Jansson();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action', function() {
    addGreenery(player, '35');
    expect(player.plants).eq(2);
    card.action(player);
    expect(player.plants).eq(4);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
