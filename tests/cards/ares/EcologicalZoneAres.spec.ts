import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {EcologicalZoneAres} from '../../../src/server/cards/ares/EcologicalZoneAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('EcologicalZoneAres', function() {
  let card: EcologicalZoneAres;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new EcologicalZoneAres();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);

    const adjacentSpace = action.availableSpaces[0];
    action.cb(adjacentSpace);
    expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
    expect(adjacentSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.ANIMAL]});
  });
});

