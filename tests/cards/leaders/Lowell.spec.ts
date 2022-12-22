import {expect} from "chai";
import {LightningHarvest} from "../../../src/server/cards/base/LightningHarvest";
import {Research} from "../../../src/server/cards/base/Research";
import {CardType} from "../../../src/common/cards/CardType";
import {ICard} from "../../../src/server/cards/ICard";
import {Game} from "../../../src/server/Game";
import {SelectCard} from "../../../src/server/inputs/SelectCard";
import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {Lowell} from "../../../src/server/cards/leaders/Lowell";


describe('Lowell', function() {
  let card: Lowell;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Lowell();
    player = TestPlayer.BLUE.newPlayer();
    player.megaCredits = 8;
    player2 = TestPlayer.RED.newPlayer()
    const gameOptions = setCustomGameOptions({leaderExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions );
  });

  it('Has a wild tag', function() {
    player.playedCards.push(card);
    expect(player.tags.count(Tag.SPACE)).eq(1);
    expect(player.tags.count(Tag.SCIENCE)).eq(1);
    // expect(player.getTagCount(Tags.SCIENCE)).eq(1);

    const lightningHarvest = new LightningHarvest();
    player.playedCards.push(new Research());
    expect(lightningHarvest.canPlay(player)).is.true;
  });

  it('Cannot act: Not enough M€', function() {
    player.megaCredits = 7;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', function() {
    const selectCard = card.action(player) as SelectCard<ICard>;
    game.deferredActions.runNext(); // Pay

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.cardType === CardType.LEADER).length).eq(1);
    expect(player.playedCards.includes(card)).is.false;
    expect(player.megaCredits).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
