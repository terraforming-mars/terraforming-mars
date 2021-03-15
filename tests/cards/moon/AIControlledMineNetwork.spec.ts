import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {AIControlledMineNetwork} from '../../../src/cards/moon/AIControlledMineNetwork';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('AIControlledMineNetwork', () => {
  let player: Player;
  let card: AIControlledMineNetwork;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new AIControlledMineNetwork();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.logisticRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);

    moonData.logisticRate = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    expect(moonData.logisticRate).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

