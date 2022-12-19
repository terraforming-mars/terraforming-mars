import {expect} from "chai";
import {NaturalPreserveAres} from "../../../src/server/cards/ares/NaturalPreserveAres";
import {Game} from "../../../src/server/Game";
import { TileType } from "../../../src/common/TileType";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";
import { EmptyBoard } from "../../ares/EmptyBoard";
import {forceGenerationEnd, cast, runAllActions} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

import {Gaia} from "../../../src/server/cards/leaders/Gaia";


describe('Gaia', function() {
  let card: Gaia;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Gaia();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Takes action', function() {
    // Place a tile that grants adjacency bonuses
    const naturalPreserveAres = new NaturalPreserveAres();
    expect(naturalPreserveAres.canPlay(player)).is.true;
    naturalPreserveAres.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    // Place tiles from different players next to tile that grants adjacency bonuses
    const firstAdjacentSpace = game.board.getAdjacentSpaces(space)[0];
    const secondAdjacentSpace = game.board.getAdjacentSpaces(space)[1];
    game.addTile(player, firstAdjacentSpace, {tileType: TileType.GREENERY});
    game.addTile(player2, secondAdjacentSpace, {tileType: TileType.GREENERY});

    // Gain adjacency bonuses of all players' tiles
    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(2);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
