import {expect} from 'chai';
import {LunarEmbassy} from '../../../src/server/cards/pathfinders/LunarEmbassy';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {SpaceName} from '../../../src/server/SpaceName';
import {testGameOptions} from '../../TestingUtils';

describe('LunarEmbassy', function() {
  let card: LunarEmbassy;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LunarEmbassy();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({pathfindersExpansion: true}));
  });

  it('play', function() {
    player.production.override({});
    player.tagsForTest = {earth: 9};
    player.cardsInHand = [];
    expect(player.game.board.getSpace(SpaceName.LUNAR_EMBASSY).player).is.undefined;

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3, plants: 5}));
    expect(player.cardsInHand).has.length(1);
    expect(player.game.board.getSpace(SpaceName.LUNAR_EMBASSY).player?.id).eq(player.id);
  });
});
