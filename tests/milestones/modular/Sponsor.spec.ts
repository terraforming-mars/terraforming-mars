import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Sponsor} from '../../../src/server/milestones/modular/Sponsor';
import {TestPlayer} from '../../TestPlayer';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';

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

  it('MarsBot counts its own played pile, events included', () => {
    const pile = [new AICentral(), new AsteroidMining()];
    const bot = {playedProjectCards: pile} as unknown as IMarsBot;
    expect(milestone.marsBotCanClaim(bot)).is.false;

    // An expensive event counts for MarsBot where it would not for a player
    pile.push(new BigAsteroid());
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
