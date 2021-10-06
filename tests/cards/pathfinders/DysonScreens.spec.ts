import {expect} from 'chai';
import {TestingUtils} from '../../TestingUtils';
import {DysonScreens} from '../../../src/cards/pathfinders/DysonScreens';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {SpaceName} from '../../../src/SpaceName';
import {Units} from '../../../src/Units';

describe('DysonScreens', function() {
  let card: DysonScreens;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DysonScreens();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({pathfindersExpansion: true}));
  });

  it('play', () => {
    player.cardsInHand = [];
    expect(player.game.board.getSpace(SpaceName.DYSON_SCREENS).player).is.undefined;
    expect(player.game.getTemperature()).eq(-30);

    card.play(player);

    expect(player.cardsInHand).has.length(1);
    expect(player.game.board.getSpace(SpaceName.DYSON_SCREENS).player?.id).eq(player.id);
    expect(player.game.getTemperature()).eq(-28);
  });

  it('canAct', function() {
    player.titanium = 1;
    expect(card.canAct(player)).is.false;

    player.titanium = 2;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.titanium = 3;

    card.action(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({heat: 1, energy: 1}));
    expect(player.titanium).eq(1);
  });
});
