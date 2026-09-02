import {expect} from 'chai';
import {CeresSpaceport} from '../../../src/server/cards/pathfinders/CeresSpaceport';
import {TestPlayer} from '../../TestPlayer';
import {PlaceOceanTile} from '../../../src/server/deferredActions/PlaceOceanTile';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {Units} from '../../../src/common/Units';
import {testGame} from '../../TestingUtils';

describe('CeresSpaceport', () => {
  let card: CeresSpaceport;
  let player: TestPlayer;

  beforeEach(() => {
    card = new CeresSpaceport();
    [/* game */, player] = testGame(1, {pathfindersExpansion: true});
  });

  it('play', () => {
    player.production.override({});
    player.tagsForTest = {jovian: 9};
    player.cardsInHand = [];
    expect(player.game.board.getSpaceOrThrow(SpaceName.CERES_SPACEPORT).player).is.undefined;

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2, titanium: 5}));
    expect(player.cardsInHand).has.length(1);
    expect(player.game.deferredActions.peek()).instanceof(PlaceOceanTile);
    expect(player.game.board.getSpaceOrThrow(SpaceName.CERES_SPACEPORT).player?.id).eq(player.id);
  });
});
