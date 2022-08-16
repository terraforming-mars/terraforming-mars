import {expect} from 'chai';
import {TechnologyDemonstration} from '../../../src/server/cards/base/TechnologyDemonstration';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('TechnologyDemonstration', function() {
  it('Should play', function() {
    const card = new TechnologyDemonstration();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
