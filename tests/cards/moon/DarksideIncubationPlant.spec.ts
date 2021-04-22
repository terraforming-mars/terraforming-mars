import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {DarksideIncubationPlant} from '../../../src/cards/moon/DarksideIncubationPlant';
import {expect} from 'chai';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('DarksideIncubationPlant', () => {
  let player: TestPlayer;
  let card: DarksideIncubationPlant;
  let game: Game;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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

    let options = card.action(player);
    expect(options).is.undefined;
    expect(card.resourceCount).eq(1);

    options = card.action(player);
    expect(options).is.undefined;
    expect(card.resourceCount).eq(2);

    options = card.action(player);
    expect(options).instanceOf(OrOptions);

    // First option is add a resource.
    (options! as OrOptions).options[0].cb();
    expect(card.resourceCount).eq(3);

    // Second option removes 2 resources and raises the colony rate.
    expect(MoonExpansion.moonData(game).colonyRate).eq(0);
    (options! as OrOptions).options[1].cb();
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

