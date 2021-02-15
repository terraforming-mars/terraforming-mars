import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {MoonRoadStandardProject} from '../../../src/cards/moon/MoonRoadStandardProject';
import {expect} from 'chai';
import {SelectHowToPayDeferred} from '../../../src/deferredActions/SelectHowToPayDeferred';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';
import {MooncrateBlockFactory} from '../../../src/cards/moon/MooncrateBlockFactory';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('MoonRoadStandardProject', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MoonRoadStandardProject;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new MoonRoadStandardProject();
  });

  it('can act', () => {
    // 1. Have the money? And the steel?
    // 2. Are there spaces on the moon for a Road?
  });

  it('has discount', () => {
    card.action(player);
    let payAction = game.deferredActions.pop() as SelectHowToPayDeferred;
    expect(payAction.amount).eq(18);

    player.playedCards.push(new MooncrateBlockFactory());
    card.action(player);
    payAction = game.deferredActions.pop() as SelectHowToPayDeferred;
    expect(payAction.amount).eq(14);
  });

  it('act', () => {
    player.steel = 3;
    expect(player.getTerraformRating()).eq(14);

    card.action(player);
    const payAction = game.deferredActions.pop() as SelectHowToPayDeferred;
    payAction.options.afterPay!();

    expect(player.steel).eq(2);
    expect(moonData.logisticRate).eq(0);

    const placeTileAction = game.deferredActions.peek() as PlaceMoonRoadTile;
    placeTileAction!.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

