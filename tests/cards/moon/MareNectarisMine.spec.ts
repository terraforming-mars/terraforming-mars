import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareNectarisMine} from '../../../src/server/cards/moon/MareNectarisMine';
import {expect} from 'chai';
import {MoonSpaces} from '../../../src/server/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MareNectarisMine', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MareNectarisMine;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new MareNectarisMine();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.production.steel).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareNectaris = moonData.moon.getSpace(MoonSpaces.MARE_NECTARIS);
    expect(mareNectaris.player).eq(player);
    expect(mareNectaris.tile!.tileType).eq(TileType.MOON_MINE);
  });
});

