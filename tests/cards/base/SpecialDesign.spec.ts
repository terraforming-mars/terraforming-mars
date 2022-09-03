import {expect} from 'chai';
import {SpecialDesign} from '../../../src/server/cards/base/SpecialDesign';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SpecialDesign', function() {
  it('Should play', function() {
    const card = new SpecialDesign();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getRequirementBonus(player)).to.eq(0);
  });
});
