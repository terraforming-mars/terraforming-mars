import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';

import {SelectAmount} from "../../../src/server/inputs/SelectAmount";

import {Ender} from "../../../src/server/cards/leaders/Ender";

import {MicroMills} from "../../../src/server/cards/base/MicroMills";
import {Research} from "../../../src/server/cards/base/Research";



describe('Ender', function() {
  let card: Ender;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Ender();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new Research(), new MicroMills());
    expect(card.canAct(player)).is.true;

    const selectAmount = card.action(player) as SelectAmount;
    selectAmount.cb(2);
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(2);
  });

  it('Can only act once per game', function() {
    player.cardsInHand.push(new Research(), new MicroMills());
    (card.action(player) as SelectAmount).cb(2);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
