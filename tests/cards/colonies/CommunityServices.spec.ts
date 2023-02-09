import {expect} from 'chai';
import {Aridor} from '../../../src/server/cards/colonies/Aridor';
import {CommunityServices} from '../../../src/server/cards/colonies/CommunityServices';
import {EccentricSponsor} from '../../../src/server/cards/prelude/EccentricSponsor';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {SeptumTribus} from '../../../src/server/cards/turmoil/SeptumTribus';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('CommunityServices', function() {
  it('Should play', function() {
    const card = new CommunityServices();
    const corpo = new Aridor();
    const prelude = new EccentricSponsor();
    const researchCoordination = new ResearchCoordination();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(prelude, researchCoordination);
    player.setCorporationForTest(corpo);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.production.megacredits).to.eq(4);
  });
  it('Wild Tags', function() {
    const card = new CommunityServices();
    const corpo = new SeptumTribus();
    const prelude = new EccentricSponsor();
    const researchCoordination = new ResearchCoordination();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(prelude, researchCoordination);
    player.setCorporationForTest(corpo);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.production.megacredits).to.eq(4);
  });
});
