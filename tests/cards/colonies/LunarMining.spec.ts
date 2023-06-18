import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {LunarMining} from '../../../src/server/cards/colonies/LunarMining';
import {SpaceHotels} from '../../../src/server/cards/prelude/SpaceHotels';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('LunarMining', function() {
  it('Should play', function() {
    const card = new LunarMining();
    const card2 = new SpaceHotels();
    const card3 = new LunaGovernor();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(card2, card3);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(2);
  });
});
