import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {IActionCard} from '../ICard';
import {IStandardProjectCard} from '../IStandardProjectCard';
import {SelectCard} from '../../inputs/SelectCard';

export class StandardTechnology extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.STANDARD_TECHNOLOGY_UNDERWORLD,
      type: CardType.ACTIVE,
      cost: 6,
      tags: [Tag.SCIENCE],

      metadata: {
        cardNumber: 'UX00',
        renderData: CardRenderer.builder((b) => {
          b.empty().startAction.text('REPEAT').br;
          b.plate('Standard projects').asterix().megacredits(-8).br;
          b.plainText('(Action: Use a standard project that you\'ve already used this generation, with its cost reduced by 8 M€.)').br;
        }),
      },
    });
  }

  // TODO(kberg): Remove data by 2025-08-01
  public data: {projects: Array<CardName>} = {projects: []};

  // Controls when the standard project discount applies. It doesn't apply when normally evaluating standard projects
  //
  // Does not need to be serialized.
  private discount: boolean = false;

  private includeThisStandardProject(player: IPlayer, cardName: CardName) {
    return player.standardProjectsThisGeneration.has(cardName) || this.data.projects.includes(cardName);
  }

  private getStandardProjects(player: IPlayer) {
    this.discount = true;
    try {
      return player.game.getStandardProjects()
        .filter((card) => this.includeThisStandardProject(player, card.name))
        .filter((card) => card.canAct(player));
    } finally {
      this.discount = false;
    }
  }
  public canAct(player: IPlayer): boolean {
    return this.getStandardProjects(player).length > 0;
  }

  public action(player: IPlayer) {
    const standardProjects = this.getStandardProjects(player);
    return new SelectCard(
      'Standard projects',
      'Confirm',
      standardProjects)
      .andThen(([card]) => {
        this.discount = true;
        try {
          return card.action(player);
        } finally {
          this.discount = false;
        }
      });
  }

  public getStandardProjectDiscount(player: IPlayer, card: IStandardProjectCard): number {
    if (this.discount && this.includeThisStandardProject(player, card.name)) {
      return 8;
    }
    return 0;
  }

  onProductionPhase(): void {
    this.data = {projects: []};
  }
}
