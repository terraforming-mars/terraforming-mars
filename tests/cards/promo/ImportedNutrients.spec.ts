import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {ImportedNutrients} from '../../../src/cards/promo/ImportedNutrients';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ImportedNutrients', function() {
  let card : ImportedNutrients; let player : Player;

  beforeEach(function() {
    card = new ImportedNutrients();
    player = TestPlayers.BLUE.newPlayer();
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

    const action = card.play(player);
    expect(player.plants).to.eq(4);

    expect(action).is.not.undefined;
        action!.cb([decomposers]);
        expect(decomposers.resourceCount).to.eq(4);
  });
});
