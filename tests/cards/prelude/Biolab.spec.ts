import {expect} from 'chai';
import {Biolab} from '../../../src/cards/prelude/Biolab';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Biolab', function() {
  it('Should play', function() {
    const card = new Biolab();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    card.play(player);

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
