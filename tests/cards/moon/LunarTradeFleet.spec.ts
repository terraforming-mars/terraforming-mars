import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {LunarTradeFleet} from '../../../src/cards/moon/LunarTradeFleet';
import {expect} from 'chai';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunarTradeFleet', () => {
  let player: Player;
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

    setPlayerProductionForTest(player, {titanium: 2});
    expect(player.getPlayableCards()).does.include(card);

    setPlayerProductionForTest(player, {titanium: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    setPlayerProductionForTest(player, {megacredits: 0});
    expect(player.getTerraformRating()).eq(14);
    moonData.logisticRate = 0;

    card.play(player);

    setPlayerProductionForTest(player, {megacredits: 2});
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

