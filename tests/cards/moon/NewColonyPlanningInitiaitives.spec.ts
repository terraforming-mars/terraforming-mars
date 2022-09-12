import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {NewColonyPlanningInitiaitives} from '../../../src/server/cards/moon/NewColonyPlanningInitiaitives';
import {expect} from 'chai';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('NewColonyPlanningInitiaitives', () => {
  let player: Player;
  let card: NewColonyPlanningInitiaitives;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new NewColonyPlanningInitiaitives();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.colonyRate = 2;
    expect(player.getPlayableCards()).does.include(card);

    moonData.colonyRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    moonData.colonyRate = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.colonyRate).eq(3);
  });
});

