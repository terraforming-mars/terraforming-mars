import {expect} from 'chai';
import {MiningQuota} from '../../../src/cards/venusNext/MiningQuota';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {ResearchNetwork} from '../../../src/cards/prelude/ResearchNetwork';

describe('MiningQuota', function() {
  it('Should play', function() {
    const card = new MiningQuota();
    const player = new Player('test', Color.BLUE, false);
    player.playedCards.push(new SisterPlanetSupport);
    expect(card.canPlay(player)).is.not.true;
    player.playedCards.push(new ResearchNetwork());
    expect(card.canPlay(player)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
