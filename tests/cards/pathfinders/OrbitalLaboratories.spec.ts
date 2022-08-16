import {expect} from 'chai';
import {OrbitalLaboratories} from '../../../src/server/cards/pathfinders/OrbitalLaboratories';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('OrbitalLaboratories', function() {
  let card: OrbitalLaboratories;
  let player: TestPlayer;

  beforeEach(function() {
    card = new OrbitalLaboratories();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('play', function() {
    player.plants = 0;
    player.setProductionForTest({plants: 0});

    card.play(player);

    expect(player.plants).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(2);
  });
});
