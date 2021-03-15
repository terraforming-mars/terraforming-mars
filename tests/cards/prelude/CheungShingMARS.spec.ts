import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {BuildingIndustries} from '../../../src/cards/base/BuildingIndustries';
import {CheungShingMARS} from '../../../src/cards/prelude/CheungShingMARS';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CheungShingMARS', function() {
  let card : CheungShingMARS; let player : Player;

  beforeEach(function() {
    card = new CheungShingMARS();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Gets card discount', function() {
    const ants = new Ants();
    const buildingIndustries = new BuildingIndustries();
    expect(card.getCardDiscount(player, ants)).to.eq(0);
    expect(card.getCardDiscount(player, buildingIndustries)).to.eq(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
