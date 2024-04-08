import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {FirstLunarSettlement} from '../../../src/server/cards/moon/FirstLunarSettlement';
import {expect} from 'chai';
import {PlaceMoonHabitatTile} from '../../../src/server/moon/PlaceMoonHabitatTile';

describe('FirstLunarSettlement', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: FirstLunarSettlement;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new FirstLunarSettlement();
  });

  it('play', () => {
    expect(player.production.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);
    const placeTileAction = cast(game.deferredActions.peek(), PlaceMoonHabitatTile);
    placeTileAction.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

