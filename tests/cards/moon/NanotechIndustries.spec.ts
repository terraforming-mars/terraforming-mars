import {Game} from '../../../src/server/Game';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {NanotechIndustries} from '../../../src/server/cards/moon/NanotechIndustries';
import {expect} from 'chai';
import {PhysicsComplex} from '../../../src/server/cards/base/PhysicsComplex';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {PrideoftheEarthArkship} from '../../../src/server/cards/moon/PrideoftheEarthArkship';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';

describe('NanotechIndustries', () => {
  let player: TestPlayer;
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
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    nanotechIndustries = new NanotechIndustries();
  });

  it('act', () => {
    player.setCorporationForTest(nanotechIndustries);
    player.playedCards = [physicsComplex, searchForLife, olympusConference, prideoftheEarthArkship];
    nanotechIndustries.action(player);

    const action = cast(player.game.deferredActions.pop()?.execute(), SelectCard<IProjectCard>);

    expect(action.cards).has.members([nanotechIndustries, olympusConference, prideoftheEarthArkship]);

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

