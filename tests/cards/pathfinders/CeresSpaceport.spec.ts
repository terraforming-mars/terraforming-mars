import {expect} from 'chai';
import {CeresSpaceport} from '../../../src/server/cards/pathfinders/CeresSpaceport';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {PlaceOceanTile} from '../../../src/server/deferredActions/PlaceOceanTile';
import {SpaceName} from '../../../src/server/SpaceName';
import {Units} from '../../../src/common/Units';
import {testGameOptions} from '../../TestingUtils';

describe('CeresSpaceport', function() {
  let card: CeresSpaceport;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CeresSpaceport();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({pathfindersExpansion: true}));
  });

  it('play', function() {
    player.production.override({});
    player.tagsForTest = {jovian: 9};
    player.cardsInHand = [];
    expect(player.game.board.getSpace(SpaceName.CERES_SPACEPORT).player).is.undefined;

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2, titanium: 5}));
    expect(player.cardsInHand).has.length(1);
    expect(player.game.deferredActions.peek()).instanceof(PlaceOceanTile);
    expect(player.game.board.getSpace(SpaceName.CERES_SPACEPORT).player?.id).eq(player.id);
  });
});
