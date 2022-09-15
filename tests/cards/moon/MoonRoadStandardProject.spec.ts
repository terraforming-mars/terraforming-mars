import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonRoadStandardProject} from '../../../src/server/cards/moon/MoonRoadStandardProject';
import {expect} from 'chai';
import {SelectPaymentDeferred} from '../../../src/server/deferredActions/SelectPaymentDeferred';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';
import {MooncrateBlockFactory} from '../../../src/server/cards/moon/MooncrateBlockFactory';
import {Phase} from '../../../src/common/Phase';

describe('MoonRoadStandardProject', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MoonRoadStandardProject;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new MoonRoadStandardProject();
  });

  it('can act', () => {
    player.steel = 0;
    player.megaCredits = 18;
    expect(player.canPlay(card)).is.false;

    player.steel = 1;
    player.megaCredits = 17;
    expect(player.canPlay(card)).is.false;

    player.steel = 1;
    player.megaCredits = 18;
    expect(player.canPlay(card)).is.true;

    // 2. Are there spaces on the moon for a Road?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(18);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(14);
  });

  it('act', () => {
    player.steel = 3;
    expect(player.getTerraformRating()).eq(14);

    card.action(player);
    const payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    payAction.options.afterPay!();

    expect(player.steel).eq(2);
    expect(moonData.logisticRate).eq(0);

    const placeTileAction = cast(game.deferredActions.peek(), PlaceMoonRoadTile);
    placeTileAction.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });


  it('can act when Reds are in power.', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true, turmoilExtension: true}));
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    player.steel = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.logisticRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

