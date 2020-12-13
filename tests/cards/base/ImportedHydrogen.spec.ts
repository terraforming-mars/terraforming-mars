import {expect} from 'chai';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {ImportedHydrogen} from '../../../src/cards/base/ImportedHydrogen';
import {Pets} from '../../../src/cards/base/Pets';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {SelectOption} from '../../../src/inputs/SelectOption';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('ImportedHydrogen', function() {
  let card : ImportedHydrogen; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ImportedHydrogen();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const pets = new Pets();
    const tardigrades = new Tardigrades();
    const decomposers = new Decomposers();
    player.playedCards.push(pets, tardigrades, decomposers);

    const action = card.play(player, game);
    expect(action instanceof OrOptions).is.true;
    expect((action as OrOptions).options).has.lengthOf(3);

    (action as OrOptions).options[0].cb();
    expect(player.plants).to.eq(3);

    const selectAnimal = (action as OrOptions).options[2] as SelectOption;
    const selectMicrobe = (action as OrOptions).options[1] as SelectCard<any>;

    expect(selectMicrobe.cards).has.lengthOf(2);
    expect(selectMicrobe.cards[0]).to.eq(tardigrades);
    selectMicrobe.cb([tardigrades]);

    expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
    selectAnimal.cb();
    expect(player.getResourcesOnCard(pets)).to.eq(2);
  });

  it('Should add plants directly if no microbe or animal cards available', function() {
    expect(player.plants).to.eq(0);
    card.play(player, game);
    expect(player.plants).to.eq(3);
  });
});
