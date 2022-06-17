import {expect} from 'chai';
import {Chimera} from '../../../src/cards/pathfinders/Chimera';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {AdaptationTechnology} from '../../../src/cards/base/AdaptationTechnology';
import {Cartel} from '../../../src/cards/base/Cartel';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {CardRequirements} from '../../../src/cards/CardRequirements';
import {Tags} from '../../../src/common/cards/Tags';
import {Resources} from '../../../src/common/Resources';
import {Businessperson} from '../../../src/milestones/Businessperson';
import {Scientist} from '../../../src/awards/Scientist';
import {Ecologist} from '../../../src/milestones/Ecologist';
import {Algae} from '../../../src/cards/base/Algae';
import {ArcticAlgae} from '../../../src/cards/base/ArcticAlgae';
import {Diversifier} from '../../../src/milestones/Diversifier';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';

describe('Chimera', function() {
  let card: Chimera;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Chimera();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.corporationCard = card;
  });

  it('as action', function() {
    const a = fakeCard({name: 'A' as CardName, requirements: CardRequirements.builder((f) => f.tag(Tags.EARTH, 4))});
    player.megaCredits = card.cost;
    player.playedCards = [new BusinessNetwork()];
    expect(player.canPlay(a)).is.false;
    player.playedCards = [new BusinessNetwork(), new EarthCatapult()];
    expect(player.canPlay(a)).is.true;
  });

  it('during an action', function() {
    // Cartel: Increase your M€ production 1 step for each Earth tag you have, including this.
    player.playedCards = [new BusinessNetwork(), new EarthCatapult()];
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    new Cartel().play(player);
    // Megacredit count is 2 for the played cards, one for Cartel ("including this")
    // and two for Chimera.
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('as award', function() {
    // Scientist: Having the most science tags in play
    const award = new Scientist();
    expect(award.getScore(player)).eq(1);
    player.playedCards = [new AdaptationTechnology()];
    expect(award.getScore(player)).eq(2);
  });

  it('as milestone, single tag count', function() {
    // Businessperson: Requires that you have 6 Earth tags in play
    const milestone = new Businessperson();
    player.playedCards = [new BusinessNetwork(), new EarthCatapult(), new Cartel()];
    expect(milestone.getScore(player)).eq(4);
  });

  it('as milestone - sum of multiple tags', function() {
    // Requires 4 plant tags in play
    const milestone = new Ecologist();
    player.playedCards = [new Algae(), new ArcticAlgae()];
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.false;
  });

  it('as a milestone - counting unique tags', function() {
    // Requires 8 distinct tags.
    const milestone = new Diversifier();
    player.playedCards = [new Algae(), new Tardigrades(), new EarthCatapult()];
    expect(milestone.getScore(player)).eq(4);
  });
});
