import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {VenusSoils} from '../../../src/server/cards/venusNext/VenusSoils';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {ICard} from '../../../src/server/cards/ICard';
import {testGame} from '../../TestGame';

describe('VenusSoils', () => {
  let card: VenusSoils;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusSoils();
    [game, player] = testGame(2);
  });

  it('Should play - single target', () => {
    const card2 = new Thermophiles();
    player.playedCards.push(card2);
    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(card2.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play - multiple targets', () => {
    const card2 = new Thermophiles();
    const card3 = new VenusianInsects();
    player.playedCards.push(card2, card3);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    action.cb([card2]);

    expect(card2.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
