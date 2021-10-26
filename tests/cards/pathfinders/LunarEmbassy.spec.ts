import {expect} from 'chai';
import {LunarEmbassy} from '../../../src/cards/pathfinders/LunarEmbassy';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Units} from '../../../src/Units';
import {SpaceName} from '../../../src/SpaceName';
import {TestingUtils} from '../../TestingUtils';

describe('LunarEmbassy', function() {
  let card: LunarEmbassy;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LunarEmbassy();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: true}));
  });

  it('play', function() {
    player.setProductionForTest({});
    player.tagsForTest = {earth: 9};
    player.cardsInHand = [];
    expect(player.game.board.getSpace(SpaceName.LUNAR_EMBASSY).player).is.undefined;

    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3, plants: 5}));
    expect(player.cardsInHand).has.length(1);
    expect(player.game.board.getSpace(SpaceName.LUNAR_EMBASSY).player?.id).eq(player.id);
  });
});
