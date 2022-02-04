import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MoonMineStandardProject} from '../../../src/cards/moon/MoonMineStandardProject';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {SelectHowToPayDeferred} from '../../../src/deferredActions/SelectHowToPayDeferred';
import {PlaceMoonMineTile} from '../../../src/moon/PlaceMoonMineTile';
import {MooncrateBlockFactory} from '../../../src/cards/moon/MooncrateBlockFactory';
import {Phase} from '../../../src/common/Phase';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MoonMineStandardProject', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MoonMineStandardProject;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new MoonMineStandardProject();
  });

  it('can act', () => {
    player.titanium = 1;
    player.megaCredits = 19;
    expect(player.canPlay(card)).is.false;

    player.titanium = 0;
    player.megaCredits = 20;
    expect(player.canPlay(card)).is.false;

    player.titanium = 1;
    player.megaCredits = 20;
    expect(player.canPlay(card)).is.true;

    // 2. Are there spaces on the moon for a Mine?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = game.deferredActions.pop() as SelectHowToPayDeferred;
    expect(payAction.amount).eq(20);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = game.deferredActions.pop() as SelectHowToPayDeferred;
    expect(payAction.amount).eq(16);
  });

  it('act', () => {
    player.titanium = 3;
    expect(player.getTerraformRating()).eq(14);
    expect(player.getProduction(Resources.STEEL)).eq(0);

    card.action(player);
    const payAction = game.deferredActions.pop() as SelectHowToPayDeferred;
    payAction.options.afterPay!();

    expect(player.titanium).eq(2);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(moonData.miningRate).eq(0);

    const placeTileAction = game.deferredActions.peek() as PlaceMoonMineTile;
    placeTileAction!.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('can act when Reds are in power.', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, MOON_OPTIONS);
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    player.titanium = 1;

    TestingUtils.testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.miningRate = 8;
    TestingUtils.testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

