import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonHabitatStandardProject} from '../../../src/server/cards/moon/MoonHabitatStandardProject';
import {expect} from 'chai';
import {SelectPaymentDeferred} from '../../../src/server/deferredActions/SelectPaymentDeferred';
import {PlaceMoonHabitatTile} from '../../../src/server/moon/PlaceMoonHabitatTile';
import {MooncrateBlockFactory} from '../../../src/server/cards/moon/MooncrateBlockFactory';
import {Phase} from '../../../src/common/Phase';

describe('MoonHabitatStandardProject', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MoonHabitatStandardProject;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new MoonHabitatStandardProject();
  });

  it('can act', () => {
    player.titanium = 0;
    player.megaCredits = 22;
    expect(player.canPlay(card)).is.false;

    player.titanium = 1;
    player.megaCredits = 21;
    expect(player.canPlay(card)).is.false;

    player.titanium = 1;
    player.megaCredits = 22;
    expect(player.canPlay(card)).is.true;

    // TODO(kberg): Are there spaces on the moon for a habitat?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(22);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    expect(payAction.amount).eq(18);
  });

  it('act', () => {
    player.titanium = 3;
    expect(player.getTerraformRating()).eq(14);
    expect(player.production.megacredits).eq(0);

    card.action(player);
    const payAction = cast(game.deferredActions.pop(), SelectPaymentDeferred);
    payAction.options.afterPay!();

    expect(player.titanium).eq(2);
    expect(player.production.megacredits).eq(1);

    expect(moonData.colonyRate).eq(0);

    const placeTileAction = cast(game.deferredActions.peek(), PlaceMoonHabitatTile);
    placeTileAction.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('can act when Reds are in power.', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true, turmoilExtension: true}));
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;


    // Card requirements
    player.titanium = 1;

    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    moonData.colonyRate = 8;
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

