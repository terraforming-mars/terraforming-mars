import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Reds, REDS_BONUS_1, REDS_BONUS_2, REDS_POLICY_3} from '../../../src/turmoil/parties/Reds';
import {Resources} from '../../../src/common/Resources';

describe('Reds', function() {
  let player : Player; let secondPlayer : Player; let game : Game; let turmoil: Turmoil; let reds: Reds;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    secondPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, secondPlayer], player, gameOptions);
    turmoil = game.turmoil!;
    reds = new Reds();

    TestingUtils.resetBoard(game);
  });

  it('Ruling bonus 1: The player(s) with the lowest TR gains 1 TR', function() {
    player.increaseTerraformRating();

    const secondPlayerInitialTR = secondPlayer.getTerraformRating();
    const bonus = REDS_BONUS_1;
    bonus.grant(game);
    expect(secondPlayer.getTerraformRating()).to.eq(secondPlayerInitialTR + 1);
  });

  it('Ruling bonus 1: Ties for lowest TR are resolved correctly', function() {
    const initialPlayerTR = player.getTerraformRating();
    const bonus = REDS_BONUS_1;

    bonus.grant(game);
    expect(player.getTerraformRating()).to.eq(initialPlayerTR + 1);
    expect(secondPlayer.getTerraformRating()).to.eq(initialPlayerTR + 1);
  });

  it('Ruling bonus 2: The player(s) with the highest TR loses 1 TR', function() {
    player.increaseTerraformRating();

    const playerInitialTR = player.getTerraformRating();
    const bonus = REDS_BONUS_2;
    bonus.grant(game);
    expect(player.getTerraformRating()).to.eq(playerInitialTR - 1);
  });

  it('Ruling bonus 2: Ties for highest TR are resolved correctly', function() {
    const initialPlayerTR = player.getTerraformRating();
    const bonus = REDS_BONUS_2;

    bonus.grant(game);
    expect(player.getTerraformRating()).to.eq(initialPlayerTR - 1);
    expect(secondPlayer.getTerraformRating()).to.eq(initialPlayerTR - 1);
  });

  it('Ruling policy 1: When you take an action that raises TR, you MUST pay 3 M€ per step raised', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, reds, reds.policies[0].id);

    player.megaCredits = 3;
    player.increaseTerraformRating();
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
  });

  it('Ruling policy 2: When you place a tile, pay 3 M€ or as much as possible', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, reds, reds.policies[1].id);

    player.megaCredits = 3;
    game.addGreenery(player, '10');
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).to.eq(0);
  });

  it('Ruling policy 3: Pay 4 M€ to reduce a non-maxed global parameter 1 step', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, reds, reds.policies[2].id);

    const redsPolicy = REDS_POLICY_3;
    player.megaCredits = 7;
    game.increaseOxygenLevel(player, 1);
    expect(game.getOxygenLevel()).to.eq(1);

    expect(redsPolicy.canAct(player)).to.be.true;
    redsPolicy.action(player);
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(3);
    expect(game.getOxygenLevel()).to.eq(0);
    expect(redsPolicy.canAct(player)).to.be.false;
  });

  it('Ruling policy 4: When you raise a global parameter, decrease your M€ production 1 step per step raised if possible', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, reds, reds.policies[3].id);

    game.increaseOxygenLevel(player, 1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
  });
});
