import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MomentumViriumHabitat} from '../../../src/cards/moon/MomentumViriumHabitat';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {MoonSpaces} from '../../../src/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MomentumViriumHabitat', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MomentumViriumHabitat;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new MomentumViriumHabitat();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getProduction(Resources.HEAT)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
    expect(player.getProduction(Resources.HEAT)).eq(2);

    const momentumVirium = moonData.moon.getSpace(MoonSpaces.MOMENTUM_VIRIUM);
    expect(momentumVirium.player).eq(player);
    expect(momentumVirium.tile!.tileType).eq(TileType.MOON_COLONY);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.colonyRate).eq(1);
  });
});

