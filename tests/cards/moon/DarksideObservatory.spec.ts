import {Game} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {DarksideObservatory} from '../../../src/cards/moon/DarksideObservatory';
import {expect} from 'chai';
import {PhysicsComplex} from '../../../src/cards/base/PhysicsComplex';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {OlympusConference} from '../../../src/cards/base/OlympusConference';
import {PrideoftheEarthArkship} from '../../../src/cards/moon/PrideoftheEarthArkship';
import {ProcessorFactory} from '../../../src/cards/moon/ProcessorFactory';
import {NanotechIndustries} from '../../../src/cards/moon/NanotechIndustries';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('DarksideObservatory', () => {
  let player: TestPlayer;
  let card: DarksideObservatory;

  // Physics Complex: 2 points per resource.
  const physicsComplex = new PhysicsComplex();
  // Search for Life: 3 points if 1 > 0 resources.
  const searchForLife = new SearchForLife();
  // Olympus Conference: play a card.
  const olympusConference = new OlympusConference();
  // Pride of the Earth Arkship: 1 VP
  const prideoftheEarthArkship = new PrideoftheEarthArkship();
  // ProcessorFactory: Data
  const processorFactory = new ProcessorFactory();
  // Nanotech Industries: Corp with science
  const nanotechIndustries = new NanotechIndustries();

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new DarksideObservatory();
  });

  it('can act', () => {
    player.playedCards = [];
    expect(card.canAct(player)).is.false;

    player.playedCards = [physicsComplex];
    expect(card.canAct(player)).is.false;

    player.playedCards = [searchForLife];
    expect(card.canAct(player)).is.false;

    player.playedCards = [olympusConference];
    expect(card.canAct(player)).is.true;

    player.playedCards = [prideoftheEarthArkship];
    expect(card.canAct(player)).is.true;

    player.playedCards = [processorFactory];
    expect(card.canAct(player)).is.true;

    player.playedCards = [];
    player.setCorporationForTest(nanotechIndustries);
    expect(card.canAct(player)).is.true;
  });

  it('act', () => {
    player.playedCards = [physicsComplex, searchForLife, olympusConference, prideoftheEarthArkship, processorFactory];
    player.setCorporationForTest(nanotechIndustries);
    const input = card.action(player);

    expect(input.cards).has.members([olympusConference, prideoftheEarthArkship, processorFactory, nanotechIndustries]);

    olympusConference.resourceCount = 0;
    input.cb([olympusConference]);
    expect(olympusConference.resourceCount).eq(1);

    prideoftheEarthArkship.resourceCount = 0;
    input.cb([prideoftheEarthArkship]);
    expect(prideoftheEarthArkship.resourceCount).eq(1);

    processorFactory.resourceCount = 0;
    input.cb([processorFactory]);
    expect(processorFactory.resourceCount).eq(2);

    nanotechIndustries.resourceCount = 0;
    input.cb([nanotechIndustries]);
    expect(nanotechIndustries.resourceCount).eq(1);
  });
});

