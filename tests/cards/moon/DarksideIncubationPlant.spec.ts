import {Game} from '../../../src/Game';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {DarksideIncubationPlant} from '../../../src/cards/moon/DarksideIncubationPlant';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('DarksideIncubationPlant', () => {
  let player: TestPlayer;
  let card: DarksideIncubationPlant;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new DarksideIncubationPlant();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  // TODO(kberg): action tests

  it('victoryPoints', () => {
    card.resourceCount = 0;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(2);
  });
});

