import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {IActionCard, ICard, IResourceCard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Stratopolis implements IActionCard, IProjectCard, IResourceCard {
    public cost = 22;
    public tags = [Tags.CITY, Tags.VENUS];
    public name = CardName.STRATOPOLIS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 2);
      game.addCityTile(player, SpaceName.STRATOPOLIS, SpaceType.COLONY);
      return undefined;
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 3);
    }

    public getResCards(player: Player): ICard[] {
      const resourceCards = player.getResourceCards(ResourceType.FLOATER);
      return resourceCards.filter((card) => card.tags.some((cardTag) => cardTag === Tags.VENUS));
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player) {
      const cards = this.getResCards(player);

      if (cards.length === 1) {
        player.addResourceTo(cards[0], 2);
        LogHelper.logAddResource(player, cards[0], 2);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 2 floaters',
        'Add floater(s)',
        cards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 2);
          LogHelper.logAddResource(player, foundCards[0], 2);
          return undefined;
        },
      );
    }

    public metadata: CardMetadata = {
      cardNumber: '248',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 2 floaters to ANY VENUS CARD.', (eb) => {
          eb.empty().startAction.floaters(2).secondaryTag(Tags.VENUS);
        }).br;
        b.production((pb) => pb.megacredits(2)).city().asterix();
        b.vpText('1 VP for every 3rd Floater on this card.');
      }),
      description: {
        text: 'Requires 2 science tags. Increase your MC production 2 steps. Place a City tile ON THE RESERVED AREA',
        align: 'left',
      },
      victoryPoints: CardRenderDynamicVictoryPoints.floaters(1, 3),
    };
}
