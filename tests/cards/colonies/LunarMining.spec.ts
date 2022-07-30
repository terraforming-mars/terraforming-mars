import {expect} from 'chai';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {LunarMining} from '../../../src/cards/colonies/LunarMining';
import {SpaceHotels} from '../../../src/cards/prelude/SpaceHotels';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('LunarMining', function() {
  it('Should play', function() {
    const card = new LunarMining();
    const card2 = new SpaceHotels();
    const card3 = new LunaGovernor();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(card2, card3);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
  });
});
