import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {LunaStagingStation} from '../../../src/cards/moon/LunaStagingStation';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunaStagingStation', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunaStagingStation;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunaStagingStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.logisticRate = 2;
    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);

    moonData.logisticRate = 1;
    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);

    moonData.logisticRate = 2;
    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    moonData.logisticRate = 3;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(moonData.logisticRate).eq(5);
    expect(player.getTerraformRating()).eq(16);
  });
});
