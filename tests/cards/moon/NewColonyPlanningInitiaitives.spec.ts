import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {NewColonyPlanningInitiaitives} from '../../../src/server/cards/moon/NewColonyPlanningInitiaitives';
import {expect} from 'chai';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('NewColonyPlanningInitiaitives', () => {
  let player: TestPlayer;
  let card: NewColonyPlanningInitiaitives;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    card = new NewColonyPlanningInitiaitives();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.habitatRate = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);

    moonData.habitatRate = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    moonData.habitatRate = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.habitatRate).eq(3);
  });
});

