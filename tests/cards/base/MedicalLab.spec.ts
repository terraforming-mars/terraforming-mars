import {expect} from 'chai';
import {Capital} from '../../../src/server/cards/base/Capital';
import {MedicalLab} from '../../../src/server/cards/base/MedicalLab';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('MedicalLab', function() {
  it('Should play', function() {
    const card = new MedicalLab();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(0);
    player.playedCards.push(new Capital());
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
