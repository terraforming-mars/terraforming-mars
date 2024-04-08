import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunarIndustryComplex} from '../../../src/server/cards/moon/LunarIndustryComplex';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {Units} from '../../../src/common/Units';
import {PlaceMoonMineTile} from '../../../src/server/moon/PlaceMoonMineTile';
import {cast} from '../../TestingUtils';

describe('LunarIndustryComplex', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: LunarIndustryComplex;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new LunarIndustryComplex();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.production.override(Units.EMPTY);
    expect(moonData.miningRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 2;

    card.play(player);

    const placeMineTile = cast(game.deferredActions.pop(), PlaceMoonMineTile);
    placeMineTile.execute()!.cb(moonData.moon.getSpaceOrThrow('m02'));

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(player.titanium).eq(0);
    expect(player.production.steel).eq(1);
    expect(player.production.titanium).eq(1);
    expect(player.production.energy).eq(2);
    expect(player.production.heat).eq(1);
  });
});

