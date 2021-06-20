<template>
  <div class="card-corporation-logo" v-html="getHtmlContent()"></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardName} from '../../CardName';

export default Vue.extend({
  name: 'CardCorporationLogo',
  props: {
    title: {
      type: String as () => CardName,
      required: true,
    },
  },
  methods: {
    getHtmlContent: function(): string {
      const title: CardName = this.title;
      // TODO(chosta): refactor to include only the exceptions and DRY the code

      switch (title) {
      case CardName.APHRODITE:
        return '<div class="card-aphrodite-logo">APHRODITE</div>';
      case CardName.ARKLIGHT:
        return '<div class="card-arklight-logo">ARKLIGHT</div>';
      case CardName.POSEIDON:
        return '<div class="card-poseidon-logo">POSEIDON</div>';
      case CardName.SATURN_SYSTEMS:
        return `<div class="card-saturn-logo">
        SATURN <span style="font-size:20px;display:inline-block;">&#x25CF;</span> SYSTEMS
        </div>`;
      case CardName.CELESTIC:
        return `<div class="card-celestic-logo">
        <span style="background: linear-gradient(to right, rgb(251,192,137),rgb(251,192,137),rgb(23,185,236));padding-left: 5px;">CEL</span>
        <span style="background:linear-gradient(to right,rgb(23,185,236),rgb(251,192,137))">ES</span>
        <span style="background:rgb(251,192,137);padding-right:5px;">TIC</span>
        </div>`;
      case CardName.MORNING_STAR_INC:
        return '<div class="card-morning-star-logo">MORNING STAR INC.</div>';
      case CardName.PRISTAR:
        return '<div class="card-pristar-logo">PRISTAR</div>';
      case CardName.CHEUNG_SHING_MARS:
        return `<div class="card-cheung-shing-logo">
        <span style="color:red;border:4px solid red;border-radius:50%;padding:3px 5px 3px 5px;font-size:30px;line-height:14px;box-shadow: 3px 3px 3px grey, inset 0 0 3px 3px grey;text-shadow: 3px 3px 3px grey;">㨐</span></div>
        <div style="display: inline-block; width:140px; font-size:19px; line-height: 22px; vertical-align: middle; margin-bottom: 15px;font-weight:normal;">
        &nbsp;Cheung Shing <br><div style="margin-left:10px"> ■■MARS■■ </div>
        </div>`;
      case CardName.CREDICOR:
        return '<div class="card-credicor-logo">CREDICOR</div>';
      case CardName.ECOLINE:
        return '<div class="card-ecoline-logo">ecoline</div>';
      case CardName.HELION:
        return '<div class="card-helion-logo">helion</div>';
      case CardName.INTERPLANETARY_CINEMATICS:
        return `<div style="color: #020202;font-size:17px;margin-top:10px;margin-left:-87px;">INTERPLANETARY</div>
        <div style="height:5px;margin-top:-2px;width:143px;background:linear-gradient(to right,yellow,black,yellow,black,yellow);border:5px solid #cc3333;box-shadow:3px 3px 6px grey;"></div>
        <div style="color: #020202;font-size:24px;margin-left:-89px;margin-top:-5px; display:inline-block; -webkit-transform:scale(0.5,1); -moz-transform:scale(0.5,1); -ms-transform:scale(0.5,1); -o-transform:scale(0.5,1); transform:scale(1,0.5); margin-bottom:15px;">CINEMATICS</div>`;
      case CardName.INVENTRIX:
        return `<span class="card-inventrix-logo">
        <span style="color: #020202;background-color:#6bb5c7;padding-left:4px;padding-right:4px;font-size:26px;box-shadow: 6px 6px 10px grey;">X</span>
        INVENTRIX</span>`;
      case CardName.PHOBOLOG:
        return '<span class="card-phobolog-logo">PHOBOLOG</span>';
      case CardName.POINT_LUNA:
        return '<span class="card-luna-logo">POINT LUNA</span>';
      case CardName.POLYPHEMOS:
        return '<span class="card-polyphemos-logo">POLYPHEMOS</span>';
      case CardName.SEPTUM_TRIBUS:
        return '<span class="card-septem-tribus-logo">Septem Tribus</span>';
      case CardName.TERRALABS_RESEARCH:
        return `<div style="font-size: 13px;left:32px;top:10px;font-family:Prototype;color:#222;transform:scale(2,1);position:absolute;">TERRALABS</div>
        <div style="position:absolute;top:28px;left:46px;font-size:8px;letter-spacing:2px;font-family:Prototype;transform:scale(2,1)">RESEARCH</div>`;
      case CardName.THORGATE:
        return '<span class="card-thorgate-logo">THORGATE</span>';
      case CardName.VIRON:
        return '<span class="card-viron-logo">VIRON</span>';
      case CardName.ARIDOR:
        return '<span class="card-aridor-logo">ARIDOR</span>';
      case CardName.ASTRODRILL:
        return '<span class="card-astrodril-logo">Astrodrill</span>';
      case CardName.FACTORUM:
        return '<span class="card-factorum-logo">FACTORUM</span>';
      case CardName.MANUTECH:
        return '<span class="card-manutech-logo"><span style="color:white;background:#e63900;text-shadow:none;padding-left:2px;">MA</span>NUTECH</span>';
      case CardName.AGRICOLA_INC:
        return '<span class="card-agricola-logo">Agricola Inc</span>';
      case CardName.ARCADIAN_COMMUNITIES:
        return '<span class="card-arcadian-logo"><span>Arcadian</span></br><span>Communities</span></span>';
      case CardName.INCITE:
        return '<span class="card-incite-logo">Incite</span>';
      case CardName.LAKEFRONT_RESORTS:
        return '<div class="card-lakefront-logo">LAKEFRONT <br> &nbsp;&nbsp;RESORTS</div>';
      case CardName.MINING_GUILD:
        return '<span class="card-mining-guild-logo">MINING<br>GUILD</span>';
      case CardName.PHILARES:
        return '<div class="card-philares-logo">PHIL<span style="color:#ff5858">A</span>RES</div>';
      case CardName.RECYCLON:
        return '<div class="card-recyclon-logo">Recyclon</div>';
      case CardName.ROBINSON_INDUSTRIES:
        return `<div class="card-robinson-logo"><div style="letter-spacing:4px;border-bottom:3px solid #ccc;margin-top:5px;">ROBINSON</div>
        <div style="border-bottom:3px solid #ccc;">•—•—•—•—•—•—•&nbsp;</div>
        <div style="letter-spacing:2px;">INDUSTRIES</div></div>`;
      case CardName.SPLICE:
        return `<div class="card-splice-logo"><div>SPLI<span style="color:red">C</span>E</div>
        <div STYLE="height:3px;background:red;margin-top:-3px;"></div>
        <div STYLE="font-size:10px;line-height:18px;">TACTICAL GENOMICS</div>
        </div>`;
      case CardName.STORMCRAFT_INCORPORATED:
        return `<div class="card-stormcraft-logo">
        <div class="stormcraft1">STORM</div><div class="stormcraft2">CRAFT</div>
        <div class="stormcraft3">INCOR</div><div class="stormcraft4">PORATED</div>
        </div>`;
      case CardName.TERACTOR:
        return '<span class="card-teractor-logo">TERACTOR</span>';
      case CardName.THARSIS_REPUBLIC:
        return `<div class="card-tharsis-logo">
        <div class="card-tharsis-logo-image"></div>
        <div class="card-tharsis-logo-text">Tharsis Republic</div>
        </div>`;
      case CardName.UNITED_NATIONS_MARS_INITIATIVE:
        return '<span class="card-unmi-logo">UNITED<br/>NATIONS<br/>MARS<br/>INITIATIVE</span>';
      case CardName.UTOPIA_INVEST:
        return `<div class="card-utopia-logo">
        <div class="utopia-corp-name-1">UTOPIA</div>
        <div class="utopia-corp-name-2">INVEST</div>
        </div>`;
      case CardName.VALLEY_TRUST:
        return `<div class="card-valley-trust-logo">
        <div style="display:inline-block;margin-left:25px;padding-top: 2px;margin-bottom:0px;font-size:26px;text-shadow: 2px 2px #ccc;text-align:center">VALLEY<br/> TRUST</div>
        </div>`;
      case CardName.VITOR:
        return `<div class="card-vitor-logo">
        <span style="color:white;background:orangered;padding-left:3px;">VIT</span>
        <span style="background:linear-gradient(to right, orangered,white);">O</span>
        <span style="background:white;padding-right:3px;">R</span></div>`;
      case CardName.PHARMACY_UNION:
        return '<div class="card-pharmacy-union-logo">Pharmacy<br/>Union</div>';
      case CardName.PLAYWRIGHTS:
        return '<div class="card-playwrights-logo">Playwrights</div>';
      case CardName.MIDAS:
        return '<div class="card-midas-logo">MIDAS</div>';
      case CardName.PROJECT_WORKSHOP:
        return '<div class="card-project-workshop-logo">PROJECT<br/>WORKSHOP</div>';
      case CardName.MONS_INSURANCE:
        return `<div class="card-mons-logo">
        <div class="mons0">▲</div>
        <div class="mons1">mons</div>
        <div class="mons2">INSURANCE</div>
        </div>`;
      case CardName.NANOTECH_INDUSTRIES:
        return '<div class="card-nanotech-industries-logo"></div>';
      case CardName.TEMPEST_CONSULTANCY:
        return '<div class="card-tempest-consultancy-logo"></div>';
      case CardName.THE_DARKSIDE_OF_THE_MOON_SYNDICATE:
        return '<div class="card-the-darkside-of-the-moon-syndicate-logo"></div>';
      case CardName.LUNA_HYPERLOOP_CORPORATION:
        return '<div class="card-luna-hyperloop-corporation-logo"></div>';
      case CardName.CRESCENT_RESEARCH_ASSOCIATION:
        return '<div class="card-crescent-research-association-logo"></div>';
      case CardName.LUNA_FIRST_INCORPORATED:
        return '<div class="card-luna-first-incorporated-logo"></div>';
      case CardName.THE_GRAND_LUNA_CAPITAL_GROUP:
        return '<div class="card-the-grand-luna-capital-group-logo"></div>';
      case CardName.INTRAGEN_SANCTUARY_HEADQUARTERS:
        return '<div class="card-intragen-sanctuary-headquarters-logo"></div>';
      case CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE:
        return '<div class="card-the-archaic-foundation-institute-logo"></div>';
      case CardName.CURIOSITY_II:
        return '<div class="card-curiosity-ii-logo">Curiosity II</div>';
      }
      return '';
    },
  },
});

</script>

