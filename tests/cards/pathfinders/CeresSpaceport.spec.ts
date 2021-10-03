import {expect} from 'chai';
import {CeresSpaceport} from '../../../src/cards/pathfinders/CeresSpaceport';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {PlaceOceanTile} from '../../../src/deferredActions/PlaceOceanTile';
import {SpaceName} from '../../../src/SpaceName';
import {Units} from '../../../src/Units';
import {TestingUtils} from '../../TestingUtils';

describe('CeresSpaceport', function() {
  let card: CeresSpaceport;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CeresSpaceport();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: true}));
  });

  it('play', function() {
    player.setProductionForTest({});
    player.tagsForTest = {jovian: 9};
    player.cardsInHand = [];
    expect(player.game.board.getSpace(SpaceName.CERES_SPACEPORT).player).is.undefined;

    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 2, titanium: 5}));
    expect(player.cardsInHand).has.length(1);
    expect(player.game.deferredActions.peek()).instanceof(PlaceOceanTile);
    expect(player.game.board.getSpace(SpaceName.CERES_SPACEPORT).player?.id).eq(player.id);
  });
});
