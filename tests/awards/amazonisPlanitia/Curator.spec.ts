import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Curator} from '../../../src/awards/amazonisPlanitia/Curator';
import {TestPlayers} from '../../TestPlayers';
import {fakeCard} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';

describe('Curator', () => {
  let award: Curator;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Curator();
    player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });
  it('Counts tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tags.SPACE]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tags.SPACE]}));
    expect(award.getScore(player)).to.eq(2);
  });

  it('Does not count wild tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tags.SPACE, Tags.BUILDING]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tags.WILD]}));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Does not count events', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tags.SPACE, Tags.BUILDING]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tags.SPACE, Tags.BUILDING], cardType: CardType.EVENT}));
    expect(award.getScore(player)).to.eq(1);
  });
});
