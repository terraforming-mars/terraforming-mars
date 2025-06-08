import {expect} from 'chai';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {AdaptationTechnology} from '../../../src/server/cards/base/AdaptationTechnology';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Terran} from '../../../src/server/milestones/amazonisPlanitia/Terran';
import {Scientist} from '../../../src/server/awards/Scientist';
import {Ecologist} from '../../../src/server/milestones/Ecologist';
import {Algae} from '../../../src/server/cards/base/Algae';
import {ArcticAlgae} from '../../../src/server/cards/base/ArcticAlgae';
import {Diversifier} from '../../../src/server/milestones/Diversifier';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';

describe('Chimera', () => {
  let card: Chimera;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Chimera();
    [/* game */, player] = testGame(1);
    player.corporations.push(card);
  });

  it('as action', () => {
    const a = fakeCard({name: 'A' as CardName, requirements: [{tag: Tag.EARTH, count: 4}]});
    player.megaCredits = card.cost;
    player.playedCards.push(new BusinessNetwork());
    expect(player.canPlay(a)).is.false;
    player.playedCards.push(new EarthCatapult());
    expect(player.canPlay(a)).is.true;
  });

  it('during an action', () => {
    // Cartel: Increase your M€ production 1 step for each Earth tag you have, including this.
    player.playedCards.push(new BusinessNetwork(), new EarthCatapult());
    expect(player.production.megacredits).to.eq(0);
    new Cartel().play(player);
    // Megacredit count is 2 for the played cards, one for Cartel ("including this")
    // and two for Chimera.
    expect(player.production.megacredits).to.eq(5);
  });

  it('as award', () => {
    // Scientist: Have the most science tags in play
    const award = new Scientist();
    expect(award.getScore(player)).eq(1);
    player.playedCards.push(new AdaptationTechnology());
    expect(award.getScore(player)).eq(2);
  });

  it('as milestone, single tag count', () => {
    // Terran: Have at least 6 Earth tags in play
    const milestone = new Terran();
    player.playedCards.push(new BusinessNetwork(), new EarthCatapult(), new Cartel());
    expect(milestone.getScore(player)).eq(4);
  });

  it('as milestone - sum of multiple tags', () => {
    // Requires 4 plant tags in play
    const milestone = new Ecologist();
    player.playedCards.push(new Algae(), new ArcticAlgae());
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.false;
  });

  it('as a milestone - counting unique tags', () => {
    // Requires 8 distinct tags.
    const milestone = new Diversifier();
    player.playedCards.push(new Algae(), new Tardigrades(), new EarthCatapult());
    expect(milestone.getScore(player)).eq(4);
  });
});
