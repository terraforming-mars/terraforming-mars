import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {Colony} from '../../colonies/Colony';
import {SelectColony} from '../../inputs/SelectColony';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class Aridor extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.ARIDOR,
      startingMegaCredits: 40,
      cardType: CardType.CORPORATION,
      initialActionText: 'Add a colony tile',

      metadata: {
        cardNumber: 'R20',
        description: 'You start with 40 M€. As your first action, put an additional Colony Tile of your choice into play',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(40).nbsp.placeColony();
          b.corpBox('effect', (ce) => {
            ce.effect('When you get a new type of tag in play [event cards do not count], increase your M€ production 1 step.', (eb) => {
              eb.diverseTag().startEffect.production((pb) => pb.megacredits(1));
            });
          });
        }),
      },
    });
  }
    public allTags = new Set<Tags>();
    public initialAction(player: Player) {
      const game = player.game;
      if (game.colonyDealer === undefined || !game.gameOptions.coloniesExtension) return undefined;

      const availableColonies: Colony[] = game.colonyDealer.discardedColonies;
      if (availableColonies.length === 0) return undefined;

      const selectColony = new SelectColony('Aridor first action - Select colony tile to add', 'Add colony tile', availableColonies, (colony: Colony) => {
        if (availableColonies.includes(colony)) {
          game.colonies.push(colony);
          game.colonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
          game.log('${0} added a new Colony tile: ${1}', (b) => b.player(player).colony(colony));
          this.checkActivation(colony, game);
        } else {
          throw new Error(`Colony ${colony.name} is not a discarded colony`);
        }
        return undefined;
      });
      return selectColony;
    }

    private checkActivation(colony: Colony, game: Game): void {
      if (colony.resourceType === undefined) return;
      game.getPlayers().forEach((player) => {
        if (player.corporationCard !== undefined && player.corporationCard.resourceType === colony.resourceType) {
          colony.isActive = true;
          return;
        }
        const resourceCard = player.playedCards.find((card) => card.resourceType === colony.resourceType);
        if (resourceCard !== undefined) {
          colony.isActive = true;
          return;
        }
      });
    }

    public onCardPlayed(player: Player, card: IProjectCard) {
      if (
        card.cardType === CardType.EVENT ||
        card.tags.filter((tag) => tag !== Tags.WILDCARD).length === 0 ||
        !player.isCorporation(this.name)) {
        return undefined;
      }

      for (const tag of card.tags.filter((tag) => tag !== Tags.WILDCARD)) {
        const currentSize = this.allTags.size;
        this.allTags.add(tag);
        if (this.allTags.size > currentSize) {
          player.addProduction(Resources.MEGACREDITS, 1, {log: true});
        }
      }
      return undefined;
    }
    public play() {
      return undefined;
    }
}
