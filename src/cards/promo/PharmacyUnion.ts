import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';
import {all, digit, played} from '../Options';

export class PharmacyUnion extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.PHARMACY_UNION,
      startingMegaCredits: 46, // 54 minus 8 for the 2 deseases
      resourceType: ResourceType.DISEASE,

      metadata: {
        cardNumber: 'R39',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(54).cards(1, {secondaryTag: Tags.SCIENCE});
          // blank space after MC is on purpose
          b.text('(You start with 54 M€ . Draw a Science card.)', Size.TINY, false, false);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.microbes(1, {all, played}).startEffect.disease().megacredits(-4);
            });
            ce.vSpace();
            ce.effect('When ANY microbe tag is played, add a disease here and lose 4 M€ or as much as possible. When you play a science tag, remove a disease here and gain 1 TR OR if there are no diseases here, you MAY put this card face down in your EVENTS PILE to gain 3 TR.', (eb) => {
              eb.science(1, {played}).startEffect.minus().disease();
              eb.tr(1, {size: Size.SMALL}).slash().tr(3, {size: Size.SMALL, digit});
            });
          });
        }),
      },
    });
  }

    public resourceCount = 0;
    public isDisabled = false;

    public get tags() {
      if (this.isDisabled) {
        return [];
      }
      return [Tags.MICROBE, Tags.MICROBE];
    }

    public play(player: Player) {
      this.resourceCount = 2;
      player.drawCard(1, {tag: Tags.SCIENCE});
      return undefined;
    }

    public onCardPlayed(player: Player, card: IProjectCard): void {
      this._onCardPlayed(player, card);
    }

    public onCorpCardPlayed(player: Player, card: CorporationCard) {
      return this._onCardPlayed(player, card);
    }

    private _onCardPlayed(player: Player, card: IProjectCard | CorporationCard): void {
      if (this.isDisabled) return undefined;

      const game = player.game;

      const hasScienceTag = card.tags.includes(Tags.SCIENCE);
      const hasMicrobesTag = card.tags.includes(Tags.MICROBE);
      const isPharmacyUnion = player.isCorporation(CardName.PHARMACY_UNION);

      // Edge case, let player pick order of resolution (see https://github.com/bafolts/terraforming-mars/issues/1286)
      if (isPharmacyUnion && hasScienceTag && hasMicrobesTag && this.resourceCount === 0) {
        // TODO (Lynesth): Modify this when https://github.com/bafolts/terraforming-mars/issues/1670 is fixed
        if (player.canAfford(0, {tr: {tr: 3}})) {
          game.defer(new DeferredAction(
            player,
            () => {
              const orOptions = new OrOptions(
                new SelectOption('Turn it face down to gain 3 TR and lose up to 4 M€', 'Confirm', () => {
                  const megaCreditsLost = Math.min(player.megaCredits, 4);
                  this.isDisabled = true;
                  player.increaseTerraformRatingSteps(3);
                  player.deductResource(Resources.MEGACREDITS, megaCreditsLost);
                  game.log('${0} turned ${1} face down to gain 3 TR and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
                  return undefined;
                }),
                new SelectOption('Add a disease to it and lose up to 4 M€, then remove a disease to gain 1 TR', 'Confirm', () => {
                  const megaCreditsLost = Math.min(player.megaCredits, 4);
                  player.increaseTerraformRating();
                  player.megaCredits -= megaCreditsLost;
                  game.log('${0} added a disease to ${1} and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
                  game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
                  return undefined;
                }),
              );
              orOptions.title = 'Choose the order of tag resolution for Pharmacy Union';
              return orOptions;
            },
          ), -1); // Make it a priority
          return undefined;
        }
      }


      if (isPharmacyUnion && hasScienceTag) {
        const scienceTags = card.tags.filter((tag) => tag === Tags.SCIENCE).length;
        for (let i = 0; i < scienceTags; i++) {
          game.defer(new DeferredAction(
            player,
            () => {
              if (this.isDisabled) return undefined;

              if (this.resourceCount > 0) {
                if (player.canAfford(0, {tr: {tr: 1}}) === false) {
                  // TODO (Lynesth): Remove this when #1670 is fixed
                  game.log('${0} cannot remove a disease from ${1} to gain 1 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
                } else {
                  this.resourceCount--;
                  player.increaseTerraformRating();
                  game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
                }
                return undefined;
              }

              if (player.canAfford(0, {tr: {tr: 3}}) === false) {
                // TODO (Lynesth): Remove this when #1670 is fixed
                game.log('${0} cannot turn ${1} face down to gain 3 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
                return undefined;
              }

              return new OrOptions(
                new SelectOption('Turn this card face down and gain 3 TR', 'Gain TR', () => {
                  this.isDisabled = true;
                  player.increaseTerraformRatingSteps(3);
                  game.log('${0} turned ${1} face down to gain 3 TR', (b) => b.player(player).card(this));
                  return undefined;
                }),
                new SelectOption('Do nothing', 'Confirm', () => {
                  return undefined;
                }),
              );
            },
          ), -1); // Make it a priority
        }
      }


      if (hasMicrobesTag) {
        game.defer(new DeferredAction(
          player,
          () => {
            const microbeTagCount = card.tags.filter((cardTag) => cardTag === Tags.MICROBE).length;
            const player = game.getPlayers().find((p) => p.isCorporation(this.name))!;
            const megaCreditsLost = Math.min(player.megaCredits, microbeTagCount * 4);
            player.addResourceTo(this, microbeTagCount);
            player.megaCredits -= megaCreditsLost;
            game.log('${0} added a disease to ${1} and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
            return undefined;
          },
        ), -1); // Make it a priority
      }

      return undefined;
    }
}
