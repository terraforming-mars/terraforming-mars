import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {DeuteriumExport} from '../../../src/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {ExtractorBalloons} from '../../../src/cards/venusNext/ExtractorBalloons';
import {StratosphericBirds} from '../../../src/cards/venusNext/StratosphericBirds';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('StratosphericBirds', function() {
  let card : StratosphericBirds; let player : Player; let game : Game; let deuteriumExport: DeuteriumExport;

  beforeEach(function() {
    card = new StratosphericBirds();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    deuteriumExport = new DeuteriumExport();
  });

  it('Can\'t play if Venus requirement not met', function() {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    (game as any).venusScaleLevel = 10;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if no floater', function() {
    (game as any).venusScaleLevel = 12;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    (game as any).venusScaleLevel = 12;
    expect(card.canPlay(player, game)).is.true;
    player.playedCards.push(card);

    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);
    expect(game.deferredActions.shift()!.execute()).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(player.getResourcesOnCard(card)).to.eq(1);

    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(8);
  });

  it('Allows to choose card to remove floater from', function() {
    const extractorBalloons = new ExtractorBalloons();

    // Add cards to remove floater from
    player.playedCards.push(deuteriumExport, extractorBalloons);
    player.addResourceTo(deuteriumExport, 1);
    player.addResourceTo(extractorBalloons, 1);

    card.play(player, game);
    const selectCard = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    expect(selectCard.cards).has.lengthOf(2);

    selectCard.cb([deuteriumExport]);
    expect(player.getResourcesOnCard(deuteriumExport)).to.eq(0);
    expect(player.getResourcesOnCard(extractorBalloons)).to.eq(1);
  });

  it('Edge case: Dirigibles with no other floater cards', function() {
    // Add dirigibles with 1 floater
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);
    player.addResourceTo(dirigibles, 1);

    (game as any).venusScaleLevel = 12;
    player.megaCredits = 9;

    // 9 MC + 1 Dirigibles floater: Cannot play
    expect(card.canPlay(player, game)).is.not.true;


    // 12 MC + 1 Dirigibles floater: Card is playable
    player.megaCredits = 12;
    const SelectHowToPayForProjectCard = player.playProjectCard(game);
    expect(card.canPlay(player, game)).is.true;

    // Try to spend floater to pay for card: Throw an error
    expect(function() {
      SelectHowToPayForProjectCard.cb(card, {steel: 0, heat: 0, titanium: 0, megaCredits: 9, microbes: 0, floaters: 1});
    }).to.throw('Cannot spend all floaters to play Stratospheric Birds');

    // Pay with MC only: Can play
    SelectHowToPayForProjectCard.cb(card, {steel: 0, heat: 0, titanium: 0, megaCredits: 12, microbes: 0, floaters: 0});
        game.deferredActions.shift()!.execute(); // Remove floater
        expect(dirigibles.resourceCount).to.eq(0);
  });

  it('Allow spending all floaters from Dirigibles if there\'s at least one other card with a floater', function() {
    const dirigibles = new Dirigibles();
    player.playedCards.push(deuteriumExport, dirigibles);
    player.addResourceTo(deuteriumExport, 1);
    player.addResourceTo(dirigibles, 3);

    (game as any).venusScaleLevel = 12;
    player.megaCredits = 3;

    const selectHowToPayForCard = player.playProjectCard(game);
    expect(card.canPlay(player, game)).is.true;

    // Spend all 3 floaters from Dirigibles to pay for the card
    selectHowToPayForCard.cb(card, {steel: 0, heat: 0, titanium: 0, megaCredits: 3, microbes: 0, floaters: 3});
        game.deferredActions.shift()!.execute(); // Remove floater
        expect(player.getResourcesOnCard(dirigibles)).to.eq(0);
        expect(player.getResourcesOnCard(deuteriumExport)).to.eq(0);
        expect(player.megaCredits).to.eq(0);
  });
});
