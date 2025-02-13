import {expect} from 'chai';
import {Midas} from '../../../src/server/cards/community/Midas';
import {TestPlayer} from '../../TestPlayer';

describe('Midas', () => {
  let card: Midas;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Midas();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Starts with correct TR', () => {
    const initialTR = player.getTerraformRating();

    card.play(player);
    player.corporations.push(card);
    expect(player.getTerraformRating()).to.eq(initialTR - 7);
  });
});
