import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunarTradeFleet} from '../../../src/cards/moon/LunarTradeFleet';
import {expect} from 'chai';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarTradeFleet', () => {
  let player: TestPlayer;
  let card: LunarTradeFleet;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunarTradeFleet();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.setProductionForTest({titanium: 2});
    expect(player.getPlayableCards()).does.include(card);

    player.setProductionForTest({titanium: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.setProductionForTest({megacredits: 0});
    expect(player.getTerraformRating()).eq(14);
    moonData.logisticRate = 0;

    card.play(player);

    player.setProductionForTest({megacredits: 2});
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

