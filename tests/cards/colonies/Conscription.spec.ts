import {expect} from 'chai';
import {Conscription} from '../../../src/cards/colonies/Conscription';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';


describe('Conscription', function() {
  it('Should apply card discount until next card played', function() {
    const card = new Conscription();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    expect(card.getCardDiscount(player, game)).to.eq(0);
  });
});
