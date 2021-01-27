import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {NewColonyPlanningInitiaitives} from '../../../src/cards/moon/NewColonyPlanningInitiaitives';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('NewColonyPlanningInitiaitives', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: NewColonyPlanningInitiaitives;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new NewColonyPlanningInitiaitives();
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

    moonData.colonyRate = 3;
    expect(player.getTerraformRating()).eq(15);
  });
});
