import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {ImportedHydrogen} from '../../../src/server/cards/base/ImportedHydrogen';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ImportedHydrogen', function() {
  let card: ImportedHydrogen;
  let player: Player;

  beforeEach(function() {
    card = new ImportedHydrogen();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const pets = new Pets();
    const tardigrades = new Tardigrades();
    const decomposers = new Decomposers();
    player.playedCards.push(pets, tardigrades, decomposers);

    const action = cast(card.play(player), OrOptions);
    expect(action.options).has.lengthOf(3);

    action.options[0].cb();
    expect(player.plants).to.eq(3);

    const selectAnimal = cast(action.options[2], SelectOption);
    const selectMicrobe = cast(action.options[1], SelectCard);

    expect(selectMicrobe.cards).has.lengthOf(2);
    expect(selectMicrobe.cards[0]).to.eq(tardigrades);
    selectMicrobe.cb([tardigrades]);

    expect(tardigrades.resourceCount).to.eq(3);
    selectAnimal.cb();
    expect(pets.resourceCount).to.eq(2);
  });

  it('Should add plants directly if no microbe or animal cards available', function() {
    expect(player.plants).to.eq(0);
    card.play(player);
    expect(player.plants).to.eq(3);
  });
});
