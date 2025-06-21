import {expect} from 'chai';
import {DustStorm} from '../../../src/server/cards/pathfinders/DustStorm';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('DustStorm', () => {
  let card: DustStorm;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new DustStorm();
    [/* game */, player, player2, player3] = testGame(3);
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(20);
    expect(player.game.getTemperature()).eq(-30);

    player.energy = 5;
    player2.energy = 15;
    player3.energy = 400;

    card.play(player);

    expect(player.getTerraformRating()).eq(22);
    expect(player.game.getTemperature()).eq(-26);
    expect(player.energy).eq(0);
    expect(player2.energy).eq(0);
    expect(player3.energy).eq(0);
  });
});
