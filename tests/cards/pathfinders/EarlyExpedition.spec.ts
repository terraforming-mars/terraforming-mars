import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {expect} from 'chai';
import {EarlyExpedition} from '../../../src/cards/pathfinders/EarlyExpedition';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Units} from '../../../src/common/Units';
import {TestingUtils} from '../../TestingUtils';
import {SelectSpace} from '../../../src/inputs/SelectSpace';

describe('EarlyExpedition', function() {
  let card: EarlyExpedition;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new EarlyExpedition();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    (game as any).temperature = -16;
    player.setProductionForTest({energy: 1});
    expect(player.canPlayIgnoringCost(card)).is.false;

    (game as any).temperature = -18;
    player.setProductionForTest({energy: 0});
    expect(player.canPlayIgnoringCost(card)).is.false;

    (game as any).temperature = -18;
    player.setProductionForTest({energy: 1});
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    player.setProductionForTest({energy: 1});
    const lunarObservationPost = new LunarObservationPost(); // Holds data.
    player.playedCards = [lunarObservationPost];

    const selectSpace = card.play(player);
    TestingUtils.runAllActions(game);

    expect(player.getProductionForTest()).eql(Units.of({megacredits: 3}));
    expect(lunarObservationPost.resourceCount).eq(1);

    expect(selectSpace).instanceOf(SelectSpace);
    let tiles = 0;
    selectSpace.availableSpaces.forEach((space) => {
      game.board.getAdjacentSpaces(space).forEach((s) => {
        if (s.tile !== undefined) tiles++;
      });
    });
    expect(tiles).eq(0);
  });
});
