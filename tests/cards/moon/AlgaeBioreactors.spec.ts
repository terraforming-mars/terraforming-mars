import {Game} from '../../../src/Game';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AlgaeBioreactors} from '../../../src/cards/moon/AlgaeBioreactors';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('AlgaeBioreactors', () => {
  let player: TestPlayer;
  let card: AlgaeBioreactors;
  let game: Game;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new AlgaeBioreactors();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.setProductionForTest({plants: 1});
    expect(player.getPlayableCards()).does.include(card);

    player.setProductionForTest({plants: 0});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.setProductionForTest({plants: 1});
    expect(player.getTerraformRating()).eq(14);
    expect(game.getOxygenLevel()).eq(0);
    moonData.colonyRate = 0;

    card.play(player);

    expect(player.getProduction(Resources.PLANTS)).eq(0);
    expect(moonData.colonyRate).eq(1);
    expect(game.getOxygenLevel()).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });
});

