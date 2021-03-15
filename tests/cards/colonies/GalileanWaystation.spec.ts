import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/cards/base/ColonizerTrainingCamp';
import {MethaneFromTitan} from '../../../src/cards/base/MethaneFromTitan';
import {GalileanWaystation} from '../../../src/cards/colonies/GalileanWaystation';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {ResearchNetwork} from '../../../src/cards/prelude/ResearchNetwork';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('GalileanWaystation', function() {
  let card : GalileanWaystation; let player : Player; let player2: Player;

  beforeEach(function() {
    card = new GalileanWaystation();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const card2 = new ColonizerTrainingCamp();
    const card3 = new MethaneFromTitan();
    player.playedCards.push(card2);
    player2.playedCards.push(card3);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Corectly counts wildtags', function() {
    const card2 = new ColonizerTrainingCamp();
    const card3 = new MethaneFromTitan();
    const researchCoordination = new ResearchCoordination();
    const researchNetwork = new ResearchNetwork();

    player.playedCards.push(card2, researchCoordination); // Should include this wild tag
    player2.playedCards.push(card3, researchNetwork); // Should NOT include this wild tag

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
