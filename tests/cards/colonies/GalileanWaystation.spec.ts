import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {MethaneFromTitan} from '../../../src/server/cards/base/MethaneFromTitan';
import {GalileanWaystation} from '../../../src/server/cards/colonies/GalileanWaystation';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('GalileanWaystation', function() {
  let card: GalileanWaystation;
  let player: Player;
  let player2: Player;

  beforeEach(function() {
    card = new GalileanWaystation();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    const card2 = new ColonizerTrainingCamp();
    const card3 = new MethaneFromTitan();
    player.playedCards.push(card2);
    player2.playedCards.push(card3);

    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Corectly counts wildtags', function() {
    const card2 = new ColonizerTrainingCamp();
    const card3 = new MethaneFromTitan();
    const researchCoordination = new ResearchCoordination();
    const researchNetwork = new ResearchNetwork();

    player.playedCards.push(card2, researchCoordination); // Should include this wild tag
    player2.playedCards.push(card3, researchNetwork); // Should NOT include this wild tag

    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
