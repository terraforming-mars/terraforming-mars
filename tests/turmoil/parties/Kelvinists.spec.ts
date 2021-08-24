import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {ISpace} from '../../../src/boards/ISpace';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Kelvinists, KELVINISTS_BONUS_1, KELVINISTS_BONUS_2, KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4} from '../../../src/turmoil/parties/Kelvinists';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';
import {StormCraftIncorporated} from '../../../src/cards/colonies/StormCraftIncorporated';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {SelectAmount} from '../../../src/inputs/SelectAmount';

describe('Kelvinists', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let kelvinists: Kelvinists;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    kelvinists = new Kelvinists();

    TestingUtils.resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 M€ for each Heat production you have', function() {
    player.addProduction(Resources.HEAT, 5);

    const bonus = KELVINISTS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(5);
  });

  it('Ruling bonus 2: Gain 1 heat for each Heat production you have', function() {
    player.addProduction(Resources.HEAT, 5);

    const bonus = KELVINISTS_BONUS_2;
    bonus.grant(game);
    expect(player.heat).to.eq(5);
  });

  it('Ruling policy 1: Pay 10 M€ to increase your Energy and Heat production 1 step', function() {
    player.megaCredits = 10;
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_1.id);

    const kelvinistsPolicy = KELVINISTS_POLICY_1;
    kelvinistsPolicy.action(player);

    game.deferredActions.runNext();
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });

  it('Ruling policy 2: When you raise temperature, gain 3 M€ per step raised', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_2.id);

    game.increaseTemperature(player, 1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling policy 3: Convert 6 heat into temperature', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_3.id);

    const kelvinistsPolicy = KELVINISTS_POLICY_3;
    expect(kelvinistsPolicy.canAct(player)).to.be.false;

    player.addResource(Resources.HEAT, 6);
    expect(kelvinistsPolicy.canAct(player)).to.be.true;

    const initialTR = player.getTerraformRating();
    kelvinistsPolicy.action(player);
    expect(player.heat).to.eq(0);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
    expect(game.getTemperature()).to.eq(-28);
  });

  it('Ruling policy 3: Reusable action works with Stormcraft', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_3.id);

    const stormcraft = new StormCraftIncorporated();
    player.corporationCard = stormcraft;
    stormcraft.resourceCount = 2;
    player.addResource(Resources.HEAT, 8);

    const kelvinistsPolicy = KELVINISTS_POLICY_3;
    expect(kelvinistsPolicy.canAct(player)).to.be.true;

    const action = kelvinistsPolicy.action(player) as AndOptions;
    const heatOption = action.options[0] as SelectAmount;
    const floaterOption = action.options[1] as SelectAmount;

    heatOption.cb(4);
    floaterOption.cb(1);
    action.cb();

    expect(player.heat).to.eq(4);
    expect(stormcraft.resourceCount).to.eq(1);
    expect(kelvinistsPolicy.canAct(player)).to.be.true;
  });

  it('Ruling policy 4: When you place a tile, gain 2 heat', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_4.id);

    const emptySpace: ISpace = game.board.spaces.find((space) => space.bonus.length === 0) as ISpace;
    game.addTile(player, emptySpace.spaceType, emptySpace, {tileType: TileType.CITY});
    expect(player.heat).to.eq(2);
  });
});
