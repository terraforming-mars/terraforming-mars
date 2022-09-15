import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {HE3Refinery} from '../../../src/server/cards/moon/HE3Refinery';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('HE3Refinery', () => {
  let player: TestPlayer;
  let card: HE3Refinery;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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

