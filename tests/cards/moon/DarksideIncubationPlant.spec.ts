import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {DarksideIncubationPlant} from '../../../src/server/cards/moon/DarksideIncubationPlant';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('DarksideIncubationPlant', () => {
  let player: TestPlayer;
  let card: DarksideIncubationPlant;
  let game: Game;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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

  it('act', () => {
    expect(card.resourceCount).eq(0);

    const action1 = card.action(player);
    expect(action1).is.undefined;
    expect(card.resourceCount).eq(1);

    const action2 = card.action(player);
    expect(action2).is.undefined;
    expect(card.resourceCount).eq(2);

    const action3 = cast(card.action(player), OrOptions);

    // Second option is add a resource.
    action3.options[1].cb();
    expect(card.resourceCount).eq(3);

    // First option removes 2 resources and raises the colony rate.
    expect(MoonExpansion.moonData(game).colonyRate).eq(0);
    action3.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(MoonExpansion.moonData(game).colonyRate).eq(1);
  });

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

