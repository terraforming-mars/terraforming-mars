import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {Space} from '../../../src/server/boards/Space';
import {setRulingParty, setTemperature} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {KELVINISTS_BONUS_1, KELVINISTS_BONUS_2, KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4} from '../../../src/server/turmoil/parties/Kelvinists';
import {Resource} from '../../../src/common/Resource';
import {TileType} from '../../../src/common/TileType';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {testGame} from '../../TestGame';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {MAX_TEMPERATURE} from '../../../src/common/constants';
import {cast} from '@/common/utils/utils';

describe('Kelvinists', () => {
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player] = testGame(1, {turmoilExtension: true});
  });

  it('Ruling bonus 1: Gain 1 M€ for each heat production you have', () => {
    player.production.add(Resource.HEAT, 5);

    const bonus = KELVINISTS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(5);
  });

  it('Ruling bonus 2: Gain 1 heat for each heat production you have', () => {
    player.production.add(Resource.HEAT, 5);

    const bonus = KELVINISTS_BONUS_2;
    bonus.grant(game);
    expect(player.heat).to.eq(5);
  });

  it('Ruling policy 1: Pay 10 M€ to increase your energy and heat production 1 step', () => {
    player.megaCredits = 10;
    setRulingParty(game, PartyName.KELVINISTS, KELVINISTS_POLICY_1.id);

    const kelvinistsPolicy = KELVINISTS_POLICY_1;
    kelvinistsPolicy.action(player);

    game.deferredActions.runNext();
    expect(player.production.energy).to.eq(1);
    expect(player.production.heat).to.eq(1);
  });

  it('Ruling policy 2: When you raise temperature, gain 3 M€ per step raised', () => {
    setRulingParty(game, PartyName.KELVINISTS, KELVINISTS_POLICY_2.id);

    game.increaseTemperature(player, 1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling policy 3: Convert 6 heat into temperature', () => {
    setRulingParty(game, PartyName.KELVINISTS, KELVINISTS_POLICY_3.id);

    expect(KELVINISTS_POLICY_3.canAct(player)).is.false;

    player.stock.add(Resource.HEAT, 6);
    expect(KELVINISTS_POLICY_3.canAct(player)).is.true;

    const initialTR = player.terraformRating;
    KELVINISTS_POLICY_3.action(player).cb(undefined);
    expect(player.heat).to.eq(0);
    expect(player.terraformRating).to.eq(initialTR + 1);
    expect(game.getTemperature()).to.eq(-28);
  });

  it('Ruling policy 3: Reusable action works with Stormcraft', () => {
    setRulingParty(game, PartyName.KELVINISTS, KELVINISTS_POLICY_3.id);

    const stormcraft = new StormCraftIncorporated();
    player.playedCards.push(stormcraft);
    stormcraft.resourceCount = 2;
    player.stock.add(Resource.HEAT, 8);

    expect(KELVINISTS_POLICY_3.canAct(player)).is.true;

    const action = cast(KELVINISTS_POLICY_3.action(player).cb(undefined), AndOptions);
    const heatOption = cast(action.options[0], SelectAmount);
    const floaterOption = cast(action.options[1], SelectAmount);

    heatOption.cb(4);
    floaterOption.cb(1);
    action.cb(undefined);

    expect(player.heat).to.eq(4);
    expect(stormcraft.resourceCount).to.eq(1);
    expect(KELVINISTS_POLICY_3.canAct(player)).is.true;
  });

  it('Ruling policy 3: option carries maxtemp warning at MAX_TEMPERATURE', () => {
    setRulingParty(game, PartyName.KELVINISTS, KELVINISTS_POLICY_3.id);
    player.stock.add(Resource.HEAT, 10);
    setTemperature(game, MAX_TEMPERATURE);

    const option = KELVINISTS_POLICY_3.action(player);
    expect(option.warnings).to.deep.eq(['maxtemp']);
    expect(option.eligibleForDefault).is.false;
  });

  it('Ruling policy 4: When you place a tile, gain 2 heat', () => {
    setRulingParty(game, PartyName.KELVINISTS, KELVINISTS_POLICY_4.id);

    const emptySpace: Space = game.board.spaces.find((space) => space.bonus.length === 0)!;
    game.addTile(player, emptySpace, {tileType: TileType.CITY});
    expect(player.heat).to.eq(2);
  });
});
