import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {ImportedNutrients} from '../../../src/server/cards/promo/ImportedNutrients';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('ImportedNutrients', function() {
  let card: ImportedNutrients;
  let player: Player;

  beforeEach(function() {
    card = new ImportedNutrients();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can play without microbe cards', function() {
    const action = card.play(player);
    expect(player.plants).to.eq(4);
    expect(action).is.undefined;
  });

  it('Adds microbes automatically if only 1 target', function() {
    const ants = new Ants();
    player.playedCards.push(ants);

    card.play(player);
    expect(player.plants).to.eq(4);
    expect(ants.resourceCount).to.eq(4);
  });

  it('Can select target if have multiple cards collecting microbes', function() {
    const ants = new Ants();
    const decomposers = new Decomposers();
    player.playedCards.push(ants, decomposers);

    const action = cast(card.play(player), SelectCard);
    expect(player.plants).to.eq(4);

    action.cb([decomposers]);
    expect(decomposers.resourceCount).to.eq(4);
  });
});
