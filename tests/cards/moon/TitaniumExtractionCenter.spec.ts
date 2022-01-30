import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TitaniumExtractionCenter} from '../../../src/cards/moon/TitaniumExtractionCenter';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('TitaniumExtractionCenter', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: TitaniumExtractionCenter;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    expect(player.getProduction(Resources.TITANIUM)).eq(0);

    player.titanium = 4;
    moonData.miningRate = 3;
    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);


    // Play a second time. Steel rate will go up by 2.
    moonData.miningRate = 4;
    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.TITANIUM)).eq(3);
  });
});

