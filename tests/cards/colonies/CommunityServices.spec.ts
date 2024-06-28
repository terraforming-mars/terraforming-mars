import {expect} from 'chai';
import {Aridor} from '../../../src/server/cards/colonies/Aridor';
import {CommunityServices} from '../../../src/server/cards/colonies/CommunityServices';
import {EccentricSponsor} from '../../../src/server/cards/prelude/EccentricSponsor';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {SeptumTribus} from '../../../src/server/cards/turmoil/SeptumTribus';
import {cast, testGame} from '../../TestingUtils';

describe('CommunityServices', function() {
  it('Should play', function() {
    const card = new CommunityServices();
    const corp = new Aridor();
    const prelude = new EccentricSponsor();
    const researchCoordination = new ResearchCoordination();
    const [/* game*/, player] = testGame(1);
    player.playedCards.push(prelude, researchCoordination);
    player.corporations.push(corp);
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.production.megacredits).to.eq(4);
  });

  it('Wild Tags', function() {
    const card = new CommunityServices();
    const septumTribus = new SeptumTribus();
    const prelude = new EccentricSponsor();
    const researchCoordination = new ResearchCoordination();
    const [/* game*/, player] = testGame(1);
    player.playedCards.push(prelude, researchCoordination);
    player.corporations.push(septumTribus);
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.production.megacredits).to.eq(4);
  });
});
