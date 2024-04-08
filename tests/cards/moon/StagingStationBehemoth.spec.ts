import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {StagingStationBehemoth} from '../../../src/server/cards/moon/StagingStationBehemoth';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';

describe('StagingStationBehemoth', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: StagingStationBehemoth;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new StagingStationBehemoth();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    moonData.logisticRate = 0;
    expect(player.colonies.getFleetSize()).to.eq(1);

    card.play(player);

    expect(moonData.logisticRate).eq(1);
    expect(player.colonies.getFleetSize()).to.eq(3);
    expect(player.getTerraformRating()).eq(15);
  });
});

