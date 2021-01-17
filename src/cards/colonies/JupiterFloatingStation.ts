import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {IResourceCard} from '../ICard';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class JupiterFloatingStation implements IProjectCard, IResourceCard {
    public cost = 9;
    public tags = [Tags.JOVIAN];
    public name = CardName.JUPITER_FLOATING_STATION;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 3;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player, game: Game) {
      return new OrOptions(
        new SelectOption('Add 1 floater to a Jovian card', 'Add floater', () => {
          game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {
            restrictedTag: Tags.JOVIAN, title: 'Add 1 floater to a Jovian card',
          }));
          return undefined;
        }),
        new SelectOption('Gain 1 MC per floater here (max 4) ', 'Gain MC', () => {
          const amount = Math.min(this.resourceCount, 4);
          player.megaCredits += amount;
          LogHelper.logGainStandardResource(player, Resources.MEGACREDITS, amount);
          return undefined;
        }),
      );
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C19',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 floater to a JOVIAN CARD.', (eb) => {
          eb.empty().startAction.floaters(1).secondaryTag(Tags.JOVIAN);
        }).br;
        b.or().br;
        b.action('Gain 1 MC for every floater here [MAX 4].', (eb) => {
          eb.empty().startAction;
          eb.megacredits(1).slash().floaters(1).text('[max 4]', CardRenderItemSize.SMALL);
        });
      }),
      description: {
        text: 'Requires 3 Science tags.',
        align: 'left',
      },
      victoryPoints: 1,
    };
}
