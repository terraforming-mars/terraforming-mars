import {expect} from 'chai';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {HugeAsteroid} from '../../../src/server/cards/prelude/HugeAsteroid';
import {WGProject} from '../../../src/server/cards/prelude2/WGProject';
import {SmeltingPlant} from '../../../src/server/cards/prelude/SmeltingPlant';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IPreludeCard} from '../../../src/server/cards/prelude/IPreludeCard';
import {BusinessEmpire} from '../../../src/server/cards/prelude/BusinessEmpire';

describe('WGProject', () => {
  let card: WGProject;
  let player: TestPlayer;
  let game: IGame;
  let smeltingPlant: IPreludeCard;
  let donation: IPreludeCard;
  let hugeAsteroid: IPreludeCard;
  let galileanMining: IPreludeCard;
  let businessEmpire: IPreludeCard;

  beforeEach(() => {
    card = new WGProject();
    [game, player] = testGame(2, {preludeExtension: true, turmoilExtension: true});
    smeltingPlant = new SmeltingPlant();
    donation = new Donation();
    hugeAsteroid = new HugeAsteroid();
    galileanMining = new GalileanMining();
    businessEmpire = new BusinessEmpire();
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.not.true;
    game.turmoil!.chairman = player;
    expect(card.canPlay(player)).is.true;
  });

  it('canPlay - not enough preludes', () => {
    game.turmoil!.chairman = player;
    game.preludeDeck.drawPile.length = 2;
    expect(card.canPlay(player)).is.false;
  });

  it('Should play with at least 1 playable prelude', () => {
    game.preludeDeck.drawPile.push(smeltingPlant, businessEmpire, donation);

    const selectCard = cast(card.play(player), SelectCard<IPreludeCard>);

    expect(selectCard.cards).deep.eq([donation, businessEmpire, smeltingPlant]);

    selectCard.cb([donation]);

    expect(player.playedCards).deep.eq([donation]);
    expect(game.preludeDeck.discardPile).to.have.members([businessEmpire, smeltingPlant]);
  });

  it('Can play with no playable preludes drawn', () => {
    player.megaCredits = 0;
    // Both of these cards cost MC which the player does not have, and so
    // if the player plays this they will have to fizzle one of the cards.
    game.preludeDeck.drawPile.push(hugeAsteroid, businessEmpire, galileanMining);

    const selectCard = cast(card.play(player), SelectCard<IPreludeCard>);

    expect(selectCard.cards).deep.eq([galileanMining, businessEmpire, hugeAsteroid]);

    selectCard.cb([galileanMining]);
    runAllActions(game);

    expect(player.megaCredits).eq(15);
    expect(player.playedCards).is.empty;
    expect(game.preludeDeck.discardPile).to.have.members([galileanMining, businessEmpire, hugeAsteroid]);
  });
});
