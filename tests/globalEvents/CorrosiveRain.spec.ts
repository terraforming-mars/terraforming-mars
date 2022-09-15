import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {CorrosiveRain} from '../../src/server/turmoil/globalEvents/CorrosiveRain';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {cast, runAllActions, testGameOptions} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {TitanShuttles} from '../../src/server/cards/colonies/TitanShuttles';
import {TitanAirScrapping} from '../../src/server/cards/colonies/TitanAirScrapping';
import {Birds} from '../../src/server/cards/base/Birds';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {SelectOption} from '../../src/server/inputs/SelectOption';

describe('CorrosiveRain', function() {
  let card: CorrosiveRain;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new CorrosiveRain();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
    player.popWaitingFor(); // To clear out the SelectInitialCards input.
  });

  it('resolve play', function() {
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.megaCredits = 15;
    player2.megaCredits = 15;

    card.resolve(game, turmoil);
    expect(game.deferredActions).has.lengthOf(2);
    runAllActions(game);
    expect(game.deferredActions).has.lengthOf(0);
    expect(player2.cardsInHand).has.lengthOf(3);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(5);
    expect(player2.megaCredits).to.eq(5);
  });

  it('remove floaters', () => {
    const titanShuttles = new TitanShuttles();
    const titanAirScrapping = new TitanAirScrapping();
    const birds = new Birds();
    player.playedCards = [titanShuttles, titanAirScrapping, birds];

    titanShuttles.resourceCount = 3;
    titanAirScrapping.resourceCount = 1;
    birds.resourceCount = 3;

    player.megaCredits = 3;

    card.resolve(game, turmoil);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const reduce10MC = cast(orOptions.options[0], SelectOption);
    const removeFloaters = cast(orOptions.options[1], SelectCard);

    expect(player.megaCredits).eq(3);
    reduce10MC.cb();
    expect(player.megaCredits).eq(0);

    expect(titanShuttles.resourceCount).eq(3);
    expect(removeFloaters.cards).has.members([titanShuttles]);
    removeFloaters.cb([titanShuttles]);
    expect(titanShuttles.resourceCount).eq(1);
  });
});
