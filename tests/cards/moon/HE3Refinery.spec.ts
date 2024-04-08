import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {HE3Refinery} from '../../../src/server/cards/moon/HE3Refinery';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('HE3Refinery', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: HE3Refinery;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new HE3Refinery();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.include(card);
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

