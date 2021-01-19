import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {MedicalLab} from '../../../src/cards/base/MedicalLab';
import {Research} from '../../../src/cards/base/Research';
import {ValleyTrust} from '../../../src/cards/prelude/ValleyTrust';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('ValleyTrust', function() {
  let card : ValleyTrust; let player : Player;

  beforeEach(function() {
    card = new ValleyTrust();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Doesn\'t get card discount for other tags', function() {
    expect(card.getCardDiscount(player, new Ants())).to.eq(0);
  });

  it('Gets card discount for science tags', function() {
    expect(card.getCardDiscount(player, new MedicalLab())).to.eq(2);
    expect(card.getCardDiscount(player, new Research())).to.eq(4);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });
});
