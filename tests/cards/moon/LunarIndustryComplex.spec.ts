import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {LunarIndustryComplex} from '../../../src/cards/moon/LunarIndustryComplex';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {Units} from '../../../src/Units';
import {Resources} from '../../../src/Resources';
import {PlaceMoonMineTile} from '../../../src/moon/PlaceMoonMineTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarIndustryComplex', () => {
  let player: TestPlayer;
  let game: Game;
  let card: LunarIndustryComplex;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    player.setProductionForTest(Units.EMPTY);
    expect(moonData.miningRate).eq(0);
    expect(player.getTerraformRating()).eq(14);
    player.titanium = 2;

    card.play(player);
    const placeMineTile = game.deferredActions.pop() as PlaceMoonMineTile;
    placeMineTile.execute()!.cb(moonData.moon.getSpace('m02'));

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
    expect(player.getProduction(Resources.HEAT)).eq(1);
  });
});

