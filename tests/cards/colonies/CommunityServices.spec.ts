import {expect} from 'chai';
import {Aridor} from '../../../src/cards/colonies/Aridor';
import {CommunityServices} from '../../../src/cards/colonies/CommunityServices';
import {EccentricSponsor} from '../../../src/cards/prelude/EccentricSponsor';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {SeptumTribus} from '../../../src/cards/turmoil/SeptumTribus';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CommunityServices', function() {
  it('Should play', function() {
    const card = new CommunityServices();
    const corpo = new Aridor();
    const prelude = new EccentricSponsor();
    const researchCoordination = new ResearchCoordination();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.playedCards.push(prelude, researchCoordination);
    player.corporationCard = corpo;
    const action = card.play(player);
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
  it('Wild Tags', function() {
    const card = new CommunityServices();
    const corpo = new SeptumTribus();
    const prelude = new EccentricSponsor();
    const researchCoordination = new ResearchCoordination();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.playedCards.push(prelude, researchCoordination);
    player.corporationCard = corpo;
    const action = card.play(player);
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
