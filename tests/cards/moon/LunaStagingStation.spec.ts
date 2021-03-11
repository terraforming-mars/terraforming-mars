import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaStagingStation} from '../../../src/cards/moon/LunaStagingStation';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaStagingStation', () => {
  let player: Player;
  let card: LunaStagingStation;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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

