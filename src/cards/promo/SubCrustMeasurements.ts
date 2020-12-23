import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IActionCard} from './../ICard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SubCrustMeasurements implements IActionCard, IProjectCard {
    public cost = 20;
    public tags = [Tags.SCIENCE, Tags.STEEL, Tags.EARTH];
    public cardType = CardType.ACTIVE;
    public name = CardName.SUB_CRUST_MEASUREMENTS;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2;
    }

    public play() {
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public getVictoryPoints() {
      return 2;
    }

    public action(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X28',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.cards(1);
          eb.description('Action: Draw a card.');
        });
      }),
      description: 'Requires 2 science tags.',
      victoryPoints: 2,
    };
}
