import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunarIndustryComplex} from '../../../src/server/cards/moon/LunarIndustryComplex';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {Units} from '../../../src/common/Units';
import {PlaceMoonMineTile} from '../../../src/server/moon/PlaceMoonMineTile';

describe('LunarIndustryComplex', () => {
  let player: TestPlayer;
  let game: Game;
  let card: LunarIndustryComplex;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LunarIndustryComplex();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.production.override(Units.EMPTY);
    expect(moonData.miningRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 2;

    card.play(player);

    const placeMineTile = game.deferredActions.pop() as PlaceMoonMineTile;
    placeMineTile.execute()!.cb(moonData.moon.getSpace('m02'));

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(player.titanium).eq(0);
    expect(player.production.steel).eq(1);
    expect(player.production.titanium).eq(1);
    expect(player.production.energy).eq(2);
    expect(player.production.heat).eq(1);
  });
});

