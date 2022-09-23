import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TitaniumExtractionCenter} from '../../../src/server/cards/moon/TitaniumExtractionCenter';
import {expect} from 'chai';

describe('TitaniumExtractionCenter', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: TitaniumExtractionCenter;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new TitaniumExtractionCenter();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 1;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);
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
