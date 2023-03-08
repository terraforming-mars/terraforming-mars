
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {addGreenery, addCityTile, cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

import {Gaia} from '../../../src/server/cards/ceos/Gaia';
import {NaturalPreserveAres} from '../../../src/server/cards/ares/NaturalPreserveAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {EmptyBoard} from '../../ares/EmptyBoard';

describe('Gaia', function() {
  let card: Gaia;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Gaia();
    game = newTestGame(3, ARES_OPTIONS_NO_HAZARDS);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
    player.playedCards.push(card);
    game.board = EmptyBoard.newInstance();
    runAllActions(game);
  });

  it('Takes action', function() {
    // Place a tile that grants adjacency bonuses
    const naturalPreserveAres = new NaturalPreserveAres();
    naturalPreserveAres.play(player2);
    runAllActions(game);
    const action = cast(player2.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    // Place tiles from different players next to tile that grants adjacency bonuses
    const firstAdjacentSpace = game.board.getAdjacentSpaces(space)[0];
    const secondAdjacentSpace = game.board.getAdjacentSpaces(space)[1];
    addGreenery(player2, firstAdjacentSpace.id);
    addCityTile(player3, secondAdjacentSpace.id);

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
    expect(card.canAct(player)).is.false;
  });
});
