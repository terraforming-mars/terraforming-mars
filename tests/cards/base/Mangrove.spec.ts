import {expect} from 'chai';
import {Mangrove} from '../../../src/server/cards/base/Mangrove';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('Mangrove', function() {
  let card: Mangrove;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Mangrove();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);

    UnderworldTestHelper.assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
