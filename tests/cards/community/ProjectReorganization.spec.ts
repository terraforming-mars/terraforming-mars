import {expect} from 'chai';
import {ProjectReorganization} from '../../../src/server/cards/community/ProjectReorganization';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {ChooseCards} from '../../../src/server/deferredActions/ChooseCards';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Capital} from '../../../src/server/cards/base/Capital';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {Resource} from '../../../src/common/Resource';

describe('ProjectReorganization', () => {
  let card: ProjectReorganization;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ProjectReorganization();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('cannot act if energy is insufficient', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.false;
  });

  it('cannot act if discard pile is empty', () => {
    player.energy = 5;
    game.projectDeck.discardPile = [];
    expect(card.canAct(player)).is.false;
  });

  it('can act if energy >= 2 and discard pile has cards', () => {
    player.energy = 5;
    game.projectDeck.discard(new Ants());
    expect(card.canAct(player)).is.true;
  });

  it('action consumes 2 energy', () => {
    player.stock.add(Resource.ENERGY, 3);
    game.projectDeck.discard(new Ants());

    cast(card.action(player), undefined);
    expect(player.energy).eq(1);
  });

  it('should return a ChooseCards action with top 4 discard cards if possible', () => {
    const ants = new Ants();
    const birds = new Birds();
    const capital = new Capital();
    const decomposers = new Decomposers();
    const earthOffice = new EarthOffice();

    game.projectDeck.discardPile = [];
    game.projectDeck.discard(ants);
    game.projectDeck.discard(birds);
    game.projectDeck.discard(capital);
    game.projectDeck.discard(decomposers);
    game.projectDeck.discard(earthOffice);

    player.energy = 5;

    card.action(player);
    runAllActions(game);

    const choose = cast(player.popWaitingFor(), ChooseCards);
    // 顺序是后丢的先弹出，所以 top 4 应该是：birds, capital, decomposers, earthOffice
    expect(choose.cards).to.have.members([birds, capital, decomposers, earthOffice]);
    expect(game.projectDeck.discardPile).deep.eq([ants]);
  });

  it('should handle discard pile with only 3 cards', () => {
    const ants = new Ants();
    const birds = new Birds();
    const capital = new Capital();

    game.projectDeck.discardPile = [];
    game.projectDeck.discard(ants);
    game.projectDeck.discard(birds);
    game.projectDeck.discard(capital);

    player.energy = 5;

    card.action(player);
    runAllActions(game);

    const choose = cast(player.popWaitingFor(), ChooseCards);
    expect(choose.cards).to.have.members([ants, birds, capital]);
    expect(game.projectDeck.discardPile).is.empty;
  });

  it('should give 1 victory point', () => {
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
