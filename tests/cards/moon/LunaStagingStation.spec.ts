import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaStagingStation} from '../../../src/server/cards/moon/LunaStagingStation';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

describe('LunaStagingStation', () => {
  let player: Player;
  let card: LunaStagingStation;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LunaStagingStation();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    moonData.logisticRate = 2;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    moonData.logisticRate = 2;
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    moonData.logisticRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    moonData.logisticRate = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(moonData.logisticRate).eq(4);
    expect(player.getTerraformRating()).eq(16);
  });
});

