import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {EcologicalZoneAres} from '../../../src/cards/ares/EcologicalZoneAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('EcologicalZoneAres', function() {
  let card : EcologicalZoneAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EcologicalZoneAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const adjacentSpace = action.availableSpaces[0];
    action.cb(adjacentSpace);
    expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
    expect(adjacentSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.ANIMAL]});
  });
});

