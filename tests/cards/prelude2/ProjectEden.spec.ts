import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {ProjectEden} from '../../../src/server/cards/prelude2/ProjectEden';
import {IGame} from '../../../src/server/IGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {assertPlaceCity, assertPlaceGreenery, assertPlaceOcean} from '../../assertions';
import {ArcticAlgae} from '../../../src/server/cards/base/ArcticAlgae';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {Comet} from '../../../src/server/cards/base/Comet';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {toName} from '../../../src/common/utils/utils';

describe('ProjectEden', () => {
  let card: ProjectEden;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ProjectEden();
    [game, player] = testGame(2);
  });

  it('canPlay', () => {
    player.cardsInHand.push(fakeCard());
    player.cardsInHand.push(fakeCard());
    expect(card.canPlay(player)).is.false;
    player.cardsInHand.push(fakeCard());
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const a = new ArcticAlgae();
    const b = new BiomassCombustors();
    const c = new Comet();
    const d = new Decomposers();

    player.cardsInHand.push(a, b, c, d);

    cast(card.play(player), undefined);
    runAllActions(game);
    let orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options.map((option) => option.title)).deep.eq([
      'Place an ocean', 'Place a city', 'Place a greenery', 'Discard 3 cards',
    ]);

    orOptions.options[0].cb();
    runAllActions(game);

    assertPlaceOcean(player, player.popWaitingFor());

    runAllActions(game);

    orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options.map((option) => option.title)).deep.eq([
      'Place a city', 'Place a greenery', 'Discard 3 cards',
    ]);

    orOptions.options[1].cb();
    runAllActions(game);

    assertPlaceGreenery(player, player.popWaitingFor());

    runAllActions(game);

    orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options.map((option) => option.title)).deep.eq([
      'Place a city', 'Discard 3 cards',
    ]);

    orOptions.options[0].cb();
    runAllActions(game);

    assertPlaceCity(player, player.popWaitingFor());

    runAllActions(game);

    orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options.map((option) => option.title)).deep.eq([
      'Discard 3 cards',
    ]);

    orOptions.options[0].cb();
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.config.min).eq(3);
    expect(selectCard.config.max).eq(3);

    selectCard.cb([a, c, d]);

    expect(player.cardsInHand.map(toName)).deep.eq([b.name]);
    expect(game.projectDeck.discardPile.map(toName)).to.have.members([a.name, c.name, d.name]);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
