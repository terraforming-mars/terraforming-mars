import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {MomentumViriumHabitat} from '../../../src/server/cards/moon/MomentumViriumHabitat';
import {expect} from 'chai';
import {MoonSpaces} from '../../../src/common/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MomentumViriumHabitat', () => {
  let game: Game;
  let player: TestPlayer;
  let moonData: IMoonData;
  let card: MomentumViriumHabitat;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MomentumViriumHabitat();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    expect(player.production.megacredits).eq(0);
    expect(player.production.heat).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.megacredits).eq(3);
    expect(player.production.heat).eq(2);

    const momentumVirium = moonData.moon.getSpace(MoonSpaces.MOMENTUM_VIRIUM);
    expect(momentumVirium.player).eq(player);
    expect(momentumVirium.tile!.tileType).eq(TileType.MOON_HABITAT);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.habitatRate).eq(1);
  });
});

