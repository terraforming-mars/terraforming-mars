import {expect} from 'chai';
import {Satellites} from '../../../src/cards/base/Satellites';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Satellites', function() {
  it('Should play', function() {
    const card = new Satellites();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    player.playedCards.push(card);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
