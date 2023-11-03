import {expect} from 'chai';
import {DysonScreens} from '../../../src/server/cards/pathfinders/DysonScreens';
import {TestPlayer} from '../../TestPlayer';
import {SpaceName} from '../../../src/server/SpaceName';
import {Units} from '../../../src/common/Units';
import {testGame} from '../../TestGame';

describe('DysonScreens', function() {
  let card: DysonScreens;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DysonScreens();
    [/* game */, player] = testGame(1, {pathfindersExpansion: true});
  });

  it('play', () => {
    player.cardsInHand = [];
    expect(player.game.board.getSpace(SpaceName.DYSON_SCREENS).player).is.undefined;
    expect(player.game.getTemperature()).eq(-30);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    card.play(player);

    expect(player.cardsInHand).has.length(1);
    expect(player.game.board.getSpace(SpaceName.DYSON_SCREENS).player?.id).eq(player.id);
    expect(player.game.getTemperature()).eq(-28);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2, heat: 2}));
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

    expect(player.production.asUnits()).deep.eq(Units.of({heat: 1, energy: 1}));
    expect(player.titanium).eq(1);
  });
});
