import {Game} from '../../../src/server/Game';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {DeepLunarMining} from '../../../src/server/cards/moon/DeepLunarMining';
import {expect} from 'chai';

describe('DeepLunarMining', () => {
  let game: Game;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: DeepLunarMining;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new DeepLunarMining();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.titanium).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.production.titanium).eq(2);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);
  });
});

