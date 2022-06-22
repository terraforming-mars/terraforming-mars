import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Predators} from '../../../src/cards/base/Predators';
import {ResearchOutpost} from '../../../src/cards/base/ResearchOutpost';
import {Aridor} from '../../../src/cards/colonies/Aridor';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';

let card: Aridor;
let game: Game;
let player: TestPlayer;
let player2: TestPlayer;

describe('Aridor', function() {
  beforeEach(() => {
    card = new Aridor;
    // 2-player so as to not bother with pre-game action that drops a colony.
    game = newTestGame(2, {coloniesExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
  });

  it('Should play', function() {
    const play = card.play();
    expect(play).is.undefined;
    player.corporationCard = card;
    card.onCardPlayed(player, new Predators());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    card.onCardPlayed(player2, new ResearchOutpost());
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    card.onCardPlayed(player, new ResearchOutpost());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });

  // A test that directly calls initialAction is also good, but this
  // is extra due to a bug #3882
  it('initialAction from input', () => {
    player.corporationCard = card;
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
});
