import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {MoonTether} from '../../../src/cards/moon/MoonTether';
import {Tags} from '../../../src/common/cards/Tags';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MoonTether', () => {
  let player: TestPlayer;
  let card: MoonTether;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new MoonTether();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.not.include(card);

    player.playedCards.push(TestingUtils.fakeCard({tags: [Tags.SPACE, Tags.SPACE, Tags.SPACE, Tags.SPACE, Tags.SPACE]}));
    expect(player.getPlayableCards()).does.not.include(card);

    // Pushing a sixth tag will do it.
    player.playedCards.push(TestingUtils.fakeCard({tags: [Tags.SPACE]}));
    expect(player.getPlayableCards()).includes(card);
  });

  it('play', () => {
    card.play();

    expect(card.getVictoryPoints()).to.eq(1);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

