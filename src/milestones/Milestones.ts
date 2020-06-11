import { Terraformer } from "./Terraformer";
import { Mayor } from "./Mayor";
import { Gardener } from "./Gardener";
import { Builder } from "./Builder";
import { Planner } from "./Planner";
import { Hoverlord } from "./Hoverlord"
import { IMilestone } from "./IMilestone";
import { Generalist } from './Generalist';
import { Specialist } from './Specialist';
import { Ecologist } from './Ecologist';
import { Tycoon } from './Tycoon';
import { Legend } from './Legend';
import { Diversifier } from './Diversifier';
import { Tactician } from './Tactician';
import { PolarExplorer } from './PolarExplorer';
import { Energizer } from './Energizer';
import { RimSettler } from './RimSettler';

export const ORIGINAL_MILESTONES: Array<IMilestone> = [
    new Terraformer(),
    new Mayor(),
    new Gardener(),
    new Builder(),
    new Planner(),
]

export const VENUS_MILESTONES: Array<IMilestone> = [
    new Hoverlord()
]

export const ELYSIUM_MILESTONES: Array<IMilestone> = [
    new Generalist(),
    new Specialist(),
    new Ecologist(),
    new Tycoon(),
    new Legend()
]    

export const HELLAS_MILESTONES: Array<IMilestone> = [
    new Diversifier(),
    new Tactician(),
    new PolarExplorer(),
    new Energizer(),
    new RimSettler()
]    