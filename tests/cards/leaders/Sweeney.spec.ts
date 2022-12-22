import {expect} from "chai";
import {Cartel} from "../../../src/server/cards/base/Cartel";
import {EarthOffice} from "../../../src/server/cards/base/EarthOffice";
import {LunaGovernor} from "../../../src/server/cards/colonies/LunaGovernor";
import {IProjectCard} from "../../../src/server/cards/IProjectCard";
import {Sweeney} from "../../../src/server/cards/leaders/Sweeney";
import {Tag} from '../../../src/common/cards/Tag';
import {Game} from "../../../src/server/Game";
import {SelectAmount} from "../../../src/server/inputs/SelectAmount";
import {SelectCard} from "../../../src/server/inputs/SelectCard";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';


describe('Musk', function() {
  let card: Sweeney;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Sweeney();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can act without cards', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new EarthOffice(), new LunaGovernor(), new Cartel());

    const selectAmount = card.action(player) as SelectAmount;
    selectAmount.cb(3);
    const selectCardsToDiscard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    selectCardsToDiscard.cb([...selectCardsToDiscard.cards]);

    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(3);

    expect(player.cardsInHand.some((card) => !card.tags.includes(Tag.SPACE))).is.false;
    expect(player.titanium).to.eq(9);
  });

  it('Can only act once per game', function() {
    player.cardsInHand.push(new EarthOffice(), new LunaGovernor(), new Cartel());
    (card.action(player) as SelectAmount).cb(2);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
