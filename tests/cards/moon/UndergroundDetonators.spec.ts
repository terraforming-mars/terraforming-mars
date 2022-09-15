import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {UndergroundDetonators} from '../../../src/server/cards/moon/UndergroundDetonators';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

describe('UndergroundDetonators', () => {
  let player: Player;
  let card: UndergroundDetonators;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new UndergroundDetonators();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 0;
    player.titanium = 0;
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(1);
    expect(player.steel).eq(1);
    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

