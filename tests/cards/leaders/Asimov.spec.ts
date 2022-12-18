import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {OrOptions} from "../../../src/server/inputs/OrOptions";
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd} from "../../TestingUtils";

import {Asimov} from "../../../src/server/cards/leaders/Asimov";

describe('Asimov', function() {
  let card: Asimov;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Asimov();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can only act once per game', function() {
    expect(card.canAct(player)).is.true;

    const orOptions = card.action(player) as OrOptions;
    orOptions.options[0].cb();
    expect(card.isDisabled).is.true;
    expect(player.megaCredits).eq(0);

    forceGenerationEnd(game);
    expect(card.canAct(player)).is.false;
  });

  it('Cannot act if all awards are already funded', function() {
    game.fundAward(player2, game.awards[0]);
    game.fundAward(player2, game.awards[1])
    game.fundAward(player2, game.awards[2])

    expect(card.canAct(player)).is.false;
  });

  it('Has +2 score on awards', function() {
    player.playedCards.push(card);

    game.awards.forEach((award) => {
      expect(award.getScore(player)).eq(2);
    });
  });
});
