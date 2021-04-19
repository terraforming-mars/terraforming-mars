import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {RoverDriversUnion} from '../../../src/cards/moon/RoverDriversUnion';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('RoverDriversUnion', () => {
  let player: TestPlayer;
  let card: RoverDriversUnion;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new RoverDriversUnion();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.logisticRate = 2;
    expect(player.getPlayableCards()).does.include(card);

    moonData.logisticRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    moonData.logisticRate = 2;
    expect(player.getTerraformRating()).eq(14);
    player.setProductionForTest({megacredits: 0});

    card.play(player);

    expect(moonData.logisticRate).eq(3);
    expect(player.getTerraformRating()).eq(15);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);

    player.setProductionForTest({megacredits: 0});

    card.play(player);

    expect(moonData.logisticRate).eq(4);
    expect(player.getTerraformRating()).eq(16);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);
  });
});

