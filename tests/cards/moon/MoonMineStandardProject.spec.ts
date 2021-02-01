import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {MoonMineStandardProject} from '../../../src/cards/moon/MoonMineStandardProject';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {SelectHowToPayDeferred} from '../../../src/deferredActions/SelectHowToPayDeferred';
import {PlaceMoonMineTile} from '../../../src/moon/PlaceMoonMineTile';
import {MooncrateBlockFactory} from '../../../src/cards/moon/MooncrateBlockFactory';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

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
    // 1. Have the money? And the titanium?
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
});

