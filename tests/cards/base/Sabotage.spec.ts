import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Sabotage} from '../../../src/server/cards/base/Sabotage';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {MonsInsurance} from '../../../src/server/cards/promo/MonsInsurance';

describe('Sabotage', () => {
  it('Cannot play before generation 5', () => {
    const card = new Sabotage();
    const [game, player] = testGame(2);
    game.generation = 4;
    expect(card.canPlay(player)).is.false;
    game.generation = 5;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new Sabotage();
    const [game, player, player2] = testGame(2);
    game.generation = 5;
    player2.titanium = 3;
    player2.steel = 4;
    player2.megaCredits = 7;

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(4);

    action.options[0].cb();
    expect(player2.titanium).to.eq(0);

    action.options[1].cb();
    expect(player2.steel).to.eq(0);

    action.options[2].cb();
    expect(player2.megaCredits).to.eq(0);
  });

  it('Solo', () => {
    const card = new Sabotage();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
  });

  it('Solo, player has Mons Insurance', () => {
    const card = new Sabotage();
    const [/* game */, player] = testGame(1);
    player.playedCards.push(new MonsInsurance());
    player.megaCredits = 10;
    const orOptions = cast(card.play(player), OrOptions);

    expect(orOptions.options.length).eq(2);

    orOptions.options[1].cb();
    expect(player.megaCredits).eq(10);

    orOptions.options[0].cb();
    expect(player.megaCredits).eq(7);
  });
});
