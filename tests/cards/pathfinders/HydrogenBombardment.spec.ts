import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {HydrogenBombardment} from '../../../src/server/cards/pathfinders/HydrogenBombardment';
import {Game} from '../../../src/server/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('HydrogenBombardment', function() {
  let card: HydrogenBombardment;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new HydrogenBombardment();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play', function() {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player.stock.megacredits).eq(6);
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });
});
