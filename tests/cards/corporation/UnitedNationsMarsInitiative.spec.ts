import {expect} from 'chai';
import {UnitedNationsMarsInitiative} from '../../../src/cards/corporation/UnitedNationsMarsInitiative';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('UnitedNationsMarsInitiative', function() {
  let card : UnitedNationsMarsInitiative; let player : Player; let game : Game;

  beforeEach(function() {
    card = new UnitedNationsMarsInitiative();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t act if TR was not raised', function() {
    player.megaCredits = 10;
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Can\'t act if not enough MC', function() {
    player.setTerraformRating(21);
    player.megaCredits = 2;
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Should act', function() {
    player.increaseTerraformRating(game);
    player.megaCredits = 3;
    expect(card.canAct(player, game)).is.true;

    card.action(player, game);
    expect(player.megaCredits).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
