import {expect} from 'chai';
import {UnitedNationsMarsInitiative} from '../../../src/cards/corporation/UnitedNationsMarsInitiative';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('UnitedNationsMarsInitiative', function() {
  let card: UnitedNationsMarsInitiative;
  let player: Player;

  beforeEach(function() {
    card = new UnitedNationsMarsInitiative();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act if TR was not raised', function() {
    player.megaCredits = 10;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can not act if not enough MC', function() {
    player.setTerraformRating(21);
    player.megaCredits = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.increaseTerraformRating();
    player.megaCredits = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.megaCredits).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
