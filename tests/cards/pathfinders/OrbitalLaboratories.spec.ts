import {expect} from 'chai';
import {OrbitalLaboratories} from '../../../src/server/cards/pathfinders/OrbitalLaboratories';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

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
    player.production.override({plants: 0});

    card.play(player);

    expect(player.plants).eq(1);
    expect(player.production.plants).eq(2);
  });
});
