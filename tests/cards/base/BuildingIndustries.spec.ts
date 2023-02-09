import {expect} from 'chai';
import {BuildingIndustries} from '../../../src/server/cards/base/BuildingIndustries';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('BuildingIndustries', function() {
  let card: BuildingIndustries;
  let player: TestPlayer;

  beforeEach(function() {
    card = new BuildingIndustries();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
  });
});
