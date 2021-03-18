import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {NewColonyPlanningInitiaitives} from '../../../src/cards/moon/NewColonyPlanningInitiaitives';
import {expect} from 'chai';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('NewColonyPlanningInitiaitives', () => {
  let player: Player;
  let card: NewColonyPlanningInitiaitives;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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

