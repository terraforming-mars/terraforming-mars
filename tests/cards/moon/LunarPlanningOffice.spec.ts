import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunarPlanningOffice} from '../../../src/server/cards/moon/LunarPlanningOffice';
import {MareNectarisMine} from '../../../src/server/cards/moon/MareNectarisMine';
import {MareImbriumMine} from '../../../src/server/cards/moon/MareImbriumMine';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {CardName} from '../../../src/common/cards/CardName';

describe('LunarPlanningOffice', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: LunarPlanningOffice;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new LunarPlanningOffice();
  });

  it('play', () => {
    player.steel = 0;
    player.cardsInHand = [];

    // Prime the deck for a determinstic outcome.
    // Mare Imbrium is expected out first.
    game.projectDeck.drawPile.push(new RoboticWorkforce());
    game.projectDeck.drawPile.push(new MareNectarisMine());
    game.projectDeck.drawPile.push(new MicroMills());
    game.projectDeck.drawPile.push(new MareImbriumMine());
    game.projectDeck.discardPile = [];

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    expect(player.steel).eq(6);

    cast(player.popWaitingFor(), undefined);
    expect(player.cardsInHand.map((c) => c.name)).has.members([CardName.MARE_NECTARIS_MINE, CardName.MARE_IMBRIUM_MINE]);
    expect(game.projectDeck.discardPile.map((c) => c.name)).has.members([CardName.MICRO_MILLS]);

    // Robotic Workforce is at the top of the deck.
    expect(game.projectDeck.draw(game)?.name).eq(CardName.ROBOTIC_WORKFORCE);
  });
});

