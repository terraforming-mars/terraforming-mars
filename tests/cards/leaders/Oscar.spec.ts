import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {Player} from "../../../src/server/Player";
import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';

import {Turmoil} from "../../../src/server/turmoil/Turmoil";

import {Oscar} from "../../../src/server/cards/leaders/Oscar";



describe('Oscar', function() {
  let card: Oscar; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Oscar();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);
  });

  it('Has +1 influence', function() {
    card.play(player);
    expect(player.game.turmoil?.getPlayerInfluence(player)).eq(1);
  });

  it('Takes OPG action', function() {
    card.action(player);
    const turmoil = Turmoil.getTurmoil(player.game);
    expect(turmoil.chairman).eq(player.id);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
