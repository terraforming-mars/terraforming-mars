import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Sponsor} from '../../../src/server/milestones/modular/Sponsor';
import {TestPlayer} from '../../TestPlayer';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {CardType} from '@/common/cards/CardType';
import {fakeCard} from '../../TestingUtils';
import {fakeMarsBot} from '../../automa/FakeMarsBot';

describe('Sponsor', () => {
  let milestone: Sponsor;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Sponsor();
    [/* game */, player] = testGame(2);
  });

  it('Can claim', () => {
    expect(milestone.getScore(player)).eq(0);

    // Cost 2
    player.playedCards.push(new DustSeals());
    expect(milestone.getScore(player)).eq(0);
    expect(milestone.canClaim(player)).is.false;

    // Cost 21
    player.playedCards.push(new AICentral());
    expect(milestone.getScore(player)).eq(1);
    expect(milestone.canClaim(player)).is.false;

    // Cost 30
    player.playedCards.push(new AsteroidMining());
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;

    // Cost 27, event
    player.playedCards.push(new BigAsteroid());
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;

    // Cost 20
    player.playedCards.push(new GanymedeColony());
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot counts the cards costing 20 M€ or more in its played pile, events included', () => {
    const cheap = fakeCard({cost: 19, type: CardType.ACTIVE});
    const event = fakeCard({cost: 20, type: CardType.EVENT});
    const automated = fakeCard({cost: 30, type: CardType.AUTOMATED});

    for (const run of [
      {playedProjectCards: [cheap, event, automated], expected: false},
      {playedProjectCards: [cheap, event, automated, fakeCard({cost: 20, type: CardType.ACTIVE})], expected: true},
    ]) {
      const bot = {...fakeMarsBot(), playedProjectCards: run.playedProjectCards};

      expect(milestone.marsBotCanClaim(bot), `${run.playedProjectCards.length} cards`).eq(run.expected);
    }
  });
});
