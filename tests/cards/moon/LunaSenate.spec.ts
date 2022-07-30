import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaSenate} from '../../../src/cards/moon/LunaSenate';
import {Resources} from '../../../src/common/Resources';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunaSenate', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: LunaSenate;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.PURPLE.newPlayer();
    Game.newInstance('gameid', [player, player2], player, MOON_OPTIONS);
    card = new LunaSenate();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.tagsForTest = {moon: 3};
    expect(player.getPlayableCards()).does.include(card);

    player.tagsForTest = {moon: 2};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 4};
    player.setProductionForTest({megacredits: 0});

    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(9);
  });

  it('does not count opponent wild tags', () => {
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 3, wild: 2};
    player.setProductionForTest({megacredits: 0});

    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(8);
  });

  it('getVictoryPoints', () => {
    player.tagsForTest = {moon: 3};
    expect(card.getVictoryPoints(player)).eq(3);

    player.tagsForTest = {moon: 4};
    expect(card.getVictoryPoints(player)).eq(4);
  });
});

