import {expect} from "chai";
import {MicroMills} from "../../../src/server/cards/base/MicroMills";
import {Research} from "../../../src/server/cards/base/Research";
import {IProjectCard} from "../../../src/server/cards/IProjectCard";
import {Stefan} from "../../../src/server/cards/leaders/Stefan";
import {Game} from "../../../src/server/Game";
import {SelectCard} from "../../../src/server/inputs/SelectCard";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';


describe('Stefan', function() {
  let card: Stefan;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Stefan();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    const research = new Research();
    const microMills = new MicroMills();
    player.cardsInHand.push(research, microMills);
    expect(card.canAct(player)).is.true;

    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    selectCard.cb([research, microMills]);

    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).eq(6);
  });

  it('Can only act once per game', function() {
    const research = new Research();
    player.cardsInHand.push(research);

    (card.action(player) as SelectCard<IProjectCard>).cb([research]);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
