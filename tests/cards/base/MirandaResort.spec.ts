import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {MirandaResort} from '../../../src/cards/base/MirandaResort';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('MirandaResort', function() {
  it('Should play', function() {
    const card = new MirandaResort();
    const player = TestPlayers.BLUE.newPlayer();
    player.playedCards.push(new BusinessNetwork());
    const action = card.play(player);
    expect(action).is.undefined;
    player.victoryPointsBreakdown.cardVPs(card.name, card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
