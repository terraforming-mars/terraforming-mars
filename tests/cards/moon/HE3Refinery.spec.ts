import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {HE3Refinery} from '../../../src/cards/moon/HE3Refinery';
import {expect} from 'chai';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('HE3Refinery', () => {
  let player: TestPlayer;
  let card: HE3Refinery;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new HE3Refinery();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('act', () => {
    player.megaCredits = 0;
    moonData.miningRate = 0;
    card.action(player);
    expect(player.megaCredits).eq(0);

    player.megaCredits = 0;
    moonData.miningRate = 1;
    card.action(player);
    expect(player.megaCredits).eq(1);


    player.megaCredits = 0;
    moonData.miningRate = 3;
    card.action(player);
    expect(player.megaCredits).eq(3);


    player.megaCredits = 0;
    moonData.miningRate = 4;
    card.action(player);
    expect(player.megaCredits).eq(4);
  });
});

