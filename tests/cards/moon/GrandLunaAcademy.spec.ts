import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {GrandLunaAcademy} from '../../../src/cards/moon/GrandLunaAcademy';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/Game';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('GrandLunaAcademy', () => {
  let player: TestPlayer;
  let card: GrandLunaAcademy;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new GrandLunaAcademy();
  });

  it('play', () => {
    player.cardsInHand = [];
    player.tagsForTest = {moon: 1};
    card.play(player);
    expect(player.cardsInHand).has.length(0);

    player.cardsInHand = [];
    player.tagsForTest = {moon: 2};
    card.play(player);
    expect(player.cardsInHand).has.length(1);

    player.cardsInHand = [];
    player.tagsForTest = {moon: 3};
    card.play(player);
    expect(player.cardsInHand).has.length(1);

    player.cardsInHand = [];
    player.tagsForTest = {moon: 4};
    card.play(player);
    expect(player.cardsInHand).has.length(2);
  });
});

