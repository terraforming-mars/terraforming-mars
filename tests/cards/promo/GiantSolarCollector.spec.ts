import {expect} from 'chai';
import {GiantSolarCollector} from '../../../src/server/cards/promo/GiantSolarCollector';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';

describe('GiantSolarCollector', function() {
  let card: GiantSolarCollector;
  let player: TestPlayer;

  beforeEach(function() {
    card = new GiantSolarCollector();
    [/* game */, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play', function() {
    expect(player.production.asUnits()).deep.eq(Units.of({}));
    expect(player.game.getVenusScaleLevel()).eq(0);

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2}));
    expect(player.game.getVenusScaleLevel()).eq(2);
  });
});
