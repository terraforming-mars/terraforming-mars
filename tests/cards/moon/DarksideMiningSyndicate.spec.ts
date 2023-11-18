import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {DarksideMiningSyndicate} from '../../../src/server/cards/moon/DarksideMiningSyndicate';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('DarksideMiningSyndicate', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: DarksideMiningSyndicate;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new DarksideMiningSyndicate();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(player.production.titanium).eq(0);
    expect(moonData.miningRate).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);
    expect(moonData.miningRate).eq(1);

    expect(player.production.titanium).eq(2);
    expect(player.getTerraformRating()).eq(15);

    card.play(player);
    expect(moonData.miningRate).eq(2);

    expect(player.production.titanium).eq(4);
    expect(player.getTerraformRating()).eq(16);

    card.play(player);
    expect(moonData.miningRate).eq(3);

    expect(player.production.titanium).eq(5);
    expect(player.getTerraformRating()).eq(17);
  });
});

