import {expect} from 'chai';
import {LunarEmbassy} from '../../../src/server/cards/pathfinders/LunarEmbassy';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {SpaceName} from '../../../src/server/SpaceName';
import {testGame} from '../../TestingUtils';

describe('LunarEmbassy', function() {
  let card: LunarEmbassy;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LunarEmbassy();
    [/* game */, player] = testGame(1, {pathfindersExpansion: true});
  });

  it('play', function() {
    player.production.override({});
    player.tagsForTest = {earth: 9};
    player.cardsInHand = [];
    expect(player.game.board.getSpaceOrThrow(SpaceName.LUNAR_EMBASSY).player).is.undefined;

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3, plants: 5}));
    expect(player.cardsInHand).has.length(1);
    expect(player.game.board.getSpaceOrThrow(SpaceName.LUNAR_EMBASSY).player?.id).eq(player.id);
  });
});
