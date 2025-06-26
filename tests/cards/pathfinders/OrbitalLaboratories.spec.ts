import {expect} from 'chai';
import {OrbitalLaboratories} from '../../../src/server/cards/pathfinders/OrbitalLaboratories';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('OrbitalLaboratories', () => {
  let card: OrbitalLaboratories;
  let player: TestPlayer;

  beforeEach(() => {
    card = new OrbitalLaboratories();
    [/* game */, player] = testGame(1);
  });

  it('play', () => {
    player.plants = 0;
    player.production.override({plants: 0});

    card.play(player);

    expect(player.plants).eq(1);
    expect(player.production.plants).eq(2);
  });
});
