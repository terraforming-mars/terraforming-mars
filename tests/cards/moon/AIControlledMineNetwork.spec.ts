import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {AIControlledMineNetwork} from '../../../src/cards/moon/AIControlledMineNetwork';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('AIControlledMineNetwork', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: AIControlledMineNetwork;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new AIControlledMineNetwork();
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

    card.play(player);

    moonData.logisticRate = 3;
    expect(player.getTerraformRating()).eq(15);
  });
});
