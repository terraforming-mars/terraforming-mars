import {expect} from 'chai';
import {newTestGame, TestGame} from '../../TestGame';
import {HydrogenBombardment} from '../../../src/server/cards/pathfinders/HydrogenBombardment';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('HydrogenBombardment', function() {
  let card: HydrogenBombardment;
  let player: TestPlayer;
  let game: TestGame;

  beforeEach(function() {
    card = new HydrogenBombardment();
    game = newTestGame(1, {venusNextExtension: true});
    player = game.testPlayers[0];
  });

  it('Should play', function() {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player.megaCredits).eq(6);
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });
});
