import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {NanotechIndustries} from '../../../src/cards/moon/NanotechIndustries';
import {expect} from 'chai';
import {PhysicsComplex} from '../../../src/cards/base/PhysicsComplex';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {OlympusConference} from '../../../src/cards/base/OlympusConference';
import {PrideoftheEarthArkship} from '../../../src/cards/moon/PrideoftheEarthArkship';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {IProjectCard} from '../../../src/cards/IProjectCard';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('NanotechIndustries', () => {
  let player: Player;
  let nanotechIndustries: NanotechIndustries;

  // Physics Complex: 2 points per resource.
  const physicsComplex = new PhysicsComplex();
  // Search for Life: 3 points if 1 > 0 resources.
  const searchForLife = new SearchForLife();
  // Olympus Conference: play a card.
  const olympusConference = new OlympusConference();
  // Pride of the Earth Arkship: 1 VP
  const prideoftheEarthArkship = new PrideoftheEarthArkship();

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    nanotechIndustries = new NanotechIndustries();
  });

  it('act', () => {
    player.corporationCard = nanotechIndustries;
    player.playedCards = [physicsComplex, searchForLife, olympusConference, prideoftheEarthArkship];
    nanotechIndustries.action(player);

    const action: SelectCard<IProjectCard> =
      player.game.deferredActions.pop()?.execute() as SelectCard<IProjectCard>;

    expect(action!.cards).has.members([nanotechIndustries, olympusConference, prideoftheEarthArkship]);

    olympusConference.resourceCount = 0;
    action.cb([olympusConference]);
    expect(olympusConference.resourceCount).eq(1);

    prideoftheEarthArkship.resourceCount = 0;
    action.cb([prideoftheEarthArkship]);
    expect(prideoftheEarthArkship.resourceCount).eq(1);
  });

  it('victory points', () => {
    nanotechIndustries.resourceCount = 0;
    expect(nanotechIndustries.getVictoryPoints()).eq(0);
    nanotechIndustries.resourceCount = 1;
    expect(nanotechIndustries.getVictoryPoints()).eq(0);
    nanotechIndustries.resourceCount = 2;
    expect(nanotechIndustries.getVictoryPoints()).eq(1);
    nanotechIndustries.resourceCount = 3;
    expect(nanotechIndustries.getVictoryPoints()).eq(1);
    nanotechIndustries.resourceCount = 4;
    expect(nanotechIndustries.getVictoryPoints()).eq(2);
    nanotechIndustries.resourceCount = 5;
    expect(nanotechIndustries.getVictoryPoints()).eq(2);
  });
});

