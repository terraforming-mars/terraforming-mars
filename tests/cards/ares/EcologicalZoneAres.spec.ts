import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {EcologicalZoneAres} from '../../../src/server/cards/ares/EcologicalZoneAres';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('EcologicalZoneAres', function() {
  let card: EcologicalZoneAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new EcologicalZoneAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);

    const adjacentSpace = action.spaces[0];
    action.cb(adjacentSpace);
    expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(adjacentSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.ANIMAL]});
  });
});

