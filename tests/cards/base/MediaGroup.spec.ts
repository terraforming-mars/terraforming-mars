import {expect} from 'chai';
import {MediaGroup} from '../../../src/cards/base/MediaGroup';
import {Virus} from '../../../src/cards/base/Virus';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('MediaGroup', function() {
  it('Should play', function() {
    const card = new MediaGroup();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    card.onCardPlayed(player, new Virus());
    expect(player.megaCredits).to.eq(3);
    card.onCardPlayed(player, card);
    expect(player.megaCredits).to.eq(3);
  });
});
