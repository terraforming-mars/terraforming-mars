import {IProjectCard} from '../IProjectCard';
import {ICard, IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Extremophiles implements IActionCard, IProjectCard, IResourceCard {
    public cost = 3;
    public tags = [Tags.VENUS, Tags.MICROBE];
    public name = CardName.EXTREMOPHILES;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2;
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 3);
    }

    public action(player: Player) {
      const microbeCards = player.getResourceCards(ResourceType.MICROBE);
      if (microbeCards.length === 1) {
        player.addResourceTo(this);
        LogHelper.logAddResource(player, microbeCards[0]);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 1 microbe',
        'Add microbe',
        microbeCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          LogHelper.logAddResource(player, foundCards[0]);
          return undefined;
        },
      );
    }

    public metadata: CardMetadata = {
      cardNumber: '224',
      description: 'Requires 2 Science tags.',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 microbe to ANY card.', (eb) => {
          eb.empty().startAction.microbes(1).asterix();
        }).br;
        b.vpText('1 VP for every 3rd Microbe on this card.');
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 3),
    };
}
