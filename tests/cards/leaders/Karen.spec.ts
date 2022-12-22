import {expect} from "chai";
import {CardType} from "../../../src/common/cards/CardType";
import {IProjectCard} from "../../../src/server/cards/IProjectCard";
import {Karen} from "../../../src/server/cards/leaders/Karen";
import {GalileanMining} from "../../../src/server/cards/prelude/GalileanMining";
import {Game} from "../../../src/server/Game";
import {SelectCard} from "../../../src/server/inputs/SelectCard";
import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';


describe('Karen', function() {
  let card: Karen;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Karen();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);

    player.megaCredits = 20;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action', function() {
    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.length(1);
    
    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.cardType === CardType.PRELUDE)).has.length(1);
  });

  it('Takes action in Generation 4', function() {
    for (let i = 0; i < 3; i++) {
      game.deferredActions.runAll(() => {});
      forceGenerationEnd(game);
    }

    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.length(4);
    
    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.cardType === CardType.PRELUDE)).has.length(1);
  });

  it('Discards unplayable prelude cards', function() {
    player.megaCredits = 0;
    game.preludeDeck.drawPile.push(new GalileanMining());

    const action = card.action(player);
    expect(action).is.undefined;
    expect(player.playedCards.filter((card) => card.cardType === CardType.PRELUDE)).has.length(0);
  });

  it('Can only act once per game', function() {
    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    selectCard.cb([selectCard.cards[0]]);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
