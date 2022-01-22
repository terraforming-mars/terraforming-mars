import {expect} from 'chai';
import {EcologyExperts} from '../../../src/cards/prelude/EcologyExperts';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('EcologyExperts', function() {
  let card : EcologyExperts; let player : Player;

  beforeEach(function() {
    card = new EcologyExperts();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Gets requirement bonus', function() {
    expect(card.getRequirementBonus(player)).to.eq(0);
    player.lastCardPlayed = card.name;
    expect(card.getRequirementBonus(player)).to.eq(50);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
