import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Predators} from '../../../src/server/cards/base/Predators';
import {ResearchOutpost} from '../../../src/server/cards/base/ResearchOutpost';
import {Aridor} from '../../../src/server/cards/colonies/Aridor';
import {Game} from '../../../src/server/Game';
import {Venus} from '../../../src/server/cards/community/Venus';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';

let card: Aridor;
let game: Game;
let player: TestPlayer;
let player2: TestPlayer;

describe('Aridor', function() {
  beforeEach(() => {
    card = new Aridor();
    // 2-player so as to not bother with pre-game action that drops a colony.
    game = newTestGame(2, {coloniesExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.setCorporationForTest(card);
  });

  it('Should play', function() {
    const play = card.play(player);
    expect(play).is.undefined;
    card.onCardPlayed(player, new Predators());
    expect(player.production.megacredits).to.eq(1);
    card.onCardPlayed(player2, new ResearchOutpost());
    expect(player2.production.megacredits).to.eq(0);
    card.onCardPlayed(player, new ResearchOutpost());
    expect(player.production.megacredits).to.eq(4);
  });

  // A test that directly calls initialAction is also good, but this
  // is extra due to a bug #3882
  it('initialAction from input', () => {
    const playerInput = card.initialAction(player);

    expect(playerInput).is.not.undefined;

    player.setWaitingFor(playerInput!);

    const colonyInPlay = game.colonies[0];
    const discardedColony = game.discardedColonies[0];

    expect(game.colonies).does.not.include(discardedColony);
    expect(game.colonies).has.length(5);

    expect(() => player.process([[]])).to.throw('Incorrect options provided (nested)');
    expect(() => player.process([[colonyInPlay.name]])).to.throw(/Colony .* is not a discarded colony/);

    player.process([[discardedColony.name]]);

    expect(game.colonies).includes(discardedColony);
    expect(game.colonies).has.length(6);
  });


  it('initialAction - chooses Venus which cannot be activated', () => {
    const venus = new Venus();
    game.discardedColonies.push(venus);
    const playerInput = card.initialAction(player);
    expect(playerInput?.colonies).contains(venus);

    playerInput?.cb(venus);

    expect(game.colonies).includes(venus);
    expect(venus.isActive).is.false;
  });

  it('initialAction - chooses Venus, which is activated', () => {
    player2.setCorporationForTest(new Celestic());
    const venus = new Venus();
    game.discardedColonies.push(venus);
    const playerInput = card.initialAction(player);
    expect(playerInput?.colonies).contains(venus);

    playerInput?.cb(venus);

    expect(game.colonies).includes(venus);
    expect(venus.isActive).is.true;
  });
});
