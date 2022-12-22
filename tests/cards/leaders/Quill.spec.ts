import {expect} from "chai";
import {ICard} from "../../../src/server/cards/ICard";
import {Game} from "../../../src/server/Game";
import {SelectCard} from "../../../src/server/inputs/SelectCard";
import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';

import {LocalShading} from "../../../src/server/cards/venusNext/LocalShading";
import {Dirigibles} from "../../../src/server/cards/venusNext/Dirigibles";

import {Quill} from "../../../src/server/cards/leaders/Quill";


describe('Quill', function() {
  let card: Quill;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Quill();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });
  
  it('Takes action', function() {
    const dirigibles = new Dirigibles();
    const localShading = new LocalShading();
    player.playedCards.push(dirigibles, localShading);

    card.action(player);
    expect(dirigibles.resourceCount).eq(2);
    expect(localShading.resourceCount).eq(2);
    expect(game.deferredActions).has.length(1);

    const addFloaters = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addFloaters.cb([dirigibles]);
    expect(dirigibles.resourceCount).eq(4);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
