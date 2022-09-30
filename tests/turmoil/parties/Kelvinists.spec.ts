import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {ISpace} from '../../../src/server/boards/ISpace';
import {cast, testGameOptions, setRulingPartyAndRulingPolicy} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Kelvinists, KELVINISTS_BONUS_1, KELVINISTS_BONUS_2, KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4} from '../../../src/server/turmoil/parties/Kelvinists';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('Kelvinists', function() {
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let kelvinists: Kelvinists;

  beforeEach(function() {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
    kelvinists = new Kelvinists();
  });

  it('Ruling bonus 1: Gain 1 M€ for each heat production you have', function() {
    player.production.add(Resources.HEAT, 5);

    const bonus = KELVINISTS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(5);
  });

  it('Ruling bonus 2: Gain 1 heat for each heat production you have', function() {
    player.production.add(Resources.HEAT, 5);

    const bonus = KELVINISTS_BONUS_2;
    bonus.grant(game);
    expect(player.heat).to.eq(5);
  });

  it('Ruling policy 1: Pay 10 M€ to increase your energy and heat production 1 step', function() {
    player.megaCredits = 10;
    setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_1.id);

    const kelvinistsPolicy = KELVINISTS_POLICY_1;
    kelvinistsPolicy.action(player);

    game.deferredActions.runNext();
    expect(player.production.energy).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });

  it('Ruling policy 2: When you raise temperature, gain 3 M€ per step raised', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_2.id);

    game.increaseTemperature(player, 1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling policy 3: Convert 6 heat into temperature', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_3.id);

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
    setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_3.id);

    const stormcraft = new StormCraftIncorporated();
    player.setCorporationForTest(stormcraft);
    stormcraft.resourceCount = 2;
    player.addResource(Resources.HEAT, 8);

    const kelvinistsPolicy = KELVINISTS_POLICY_3;
    expect(kelvinistsPolicy.canAct(player)).to.be.true;

    const action = kelvinistsPolicy.action(player) as AndOptions;
    const heatOption = cast(action.options[0], SelectAmount);
    const floaterOption = cast(action.options[1], SelectAmount);

    heatOption.cb(4);
    floaterOption.cb(1);
    action.cb();

    expect(player.heat).to.eq(4);
    expect(stormcraft.resourceCount).to.eq(1);
    expect(kelvinistsPolicy.canAct(player)).to.be.true;
  });

  it('Ruling policy 4: When you place a tile, gain 2 heat', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, kelvinists, KELVINISTS_POLICY_4.id);

    const emptySpace: ISpace = game.board.spaces.find((space) => space.bonus.length === 0) as ISpace;
    game.addTile(player, emptySpace.spaceType, emptySpace, {tileType: TileType.CITY});
    expect(player.heat).to.eq(2);
  });
});
