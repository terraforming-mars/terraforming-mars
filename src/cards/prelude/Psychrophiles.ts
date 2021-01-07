import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class Psychrophiles implements IActionCard, IProjectCard, IResourceCard {
    public cost = 2;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags = [Tags.MICROBE];
    public name = CardName.PSYCHROPHILES;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMaxRequirements(player, GlobalParameter.TEMPERATURE, -20);
    }

    public play() {
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'P39',
      requirements: CardRequirements.builder((b) => b.temperature(-20).max()),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 microbe to this card.', (eb) => {
          eb.empty().startAction.microbes(1);
        }).br;
        b.effect('When paying for a plant card, microbes here may be used as 2 MC each.', (eb) => {
          eb.plants(1).played.startEffect.microbes(1).equals().megacredits(2);
        });
      }),
      description: 'Temperature must be -20 C or lower.',
    }
}
