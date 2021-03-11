import {expect} from 'chai';
import {TechnologyDemonstration} from '../../../src/cards/base/TechnologyDemonstration';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('TechnologyDemonstration', function() {
  it('Should play', function() {
    const card = new TechnologyDemonstration();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
