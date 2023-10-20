import {expect} from 'chai';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {testGame} from '../../TestGame';
import {setVenusScaleLevel} from '../../TestingUtils';
import {SpinInducingAsteroid} from '../../../src/server/cards/venusNext/SpinInducingAsteroid';

describe('MorningStarInc', function() {
  it('Should play', function() {
    const corp = new MorningStarInc();
    const min8Card = new IshtarMining();
    const max10Card = new SpinInducingAsteroid();
    const [game, player] = testGame(2);
    player.setCorporationForTest(corp);

    setVenusScaleLevel(game, 2);
    expect(player.simpleCanPlay(min8Card)).is.false;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 4);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 6);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 8);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 10);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 12);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 14);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.true;

    setVenusScaleLevel(game, 16);
    expect(player.simpleCanPlay(min8Card)).is.true;
    expect(player.simpleCanPlay(max10Card)).is.false;
  });
});
