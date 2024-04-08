import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {TitaniumExtractionCenter} from '../../../src/server/cards/moon/TitaniumExtractionCenter';
import {expect} from 'chai';

describe('TitaniumExtractionCenter', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: TitaniumExtractionCenter;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new TitaniumExtractionCenter();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 1;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.titanium = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(player.production.titanium).eq(0);

    player.titanium = 4;
    moonData.miningRate = 3;

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.production.titanium).eq(1);

    // Play a second time. steel rate will go up by 2.
    moonData.miningRate = 4;
    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.titanium).eq(3);
  });
});
