import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {HydrogenBombardment} from '../../../src/cards/pathfinders/HydrogenBombardment';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('HydrogenBombardment', function() {
  let card: HydrogenBombardment;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new HydrogenBombardment();
    game = newTestGame(1, {venusNextExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player.megaCredits).eq(6);
    expect(player.getProductionForTest()).deep.eq(Units.of({titanium: 1}));
  });
});
