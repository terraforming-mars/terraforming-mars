import {expect} from 'chai';
import {EcologyExperts} from '../../../src/cards/prelude/EcologyExperts';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('EcologyExperts', function() {
  let card : EcologyExperts; let player : Player; let game: Game;

  beforeEach(function() {
    card = new EcologyExperts();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Gets requirement bonus', function() {
    expect(card.getRequirementBonus(player)).to.eq(0);
    player.lastCardPlayed = card;
    expect(card.getRequirementBonus(player)).to.eq(50);
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
