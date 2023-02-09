import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {RoverDriversUnion} from '../../../src/server/cards/moon/RoverDriversUnion';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

describe('RoverDriversUnion', () => {
  let player: TestPlayer;
  let card: RoverDriversUnion;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
    player.production.override({megacredits: 0});

    card.play(player);

    expect(moonData.logisticRate).eq(3);
    expect(player.getTerraformRating()).eq(15);
    expect(player.production.megacredits).eq(3);

    player.production.override({megacredits: 0});

    card.play(player);

    expect(moonData.logisticRate).eq(4);
    expect(player.getTerraformRating()).eq(16);
    expect(player.production.megacredits).eq(4);
  });
});

