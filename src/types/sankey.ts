import {
  SankeyLink,
  SankeyNode,
  SankeyNodeMinimal,
  SankeyExtraProperties,
  SankeyLayout,
  SankeyGraph
} from "d3-sankey";
export interface LabelProperties {
  x: number;
  y: number;
  dy: number | string;
  
}
export interface LinkData extends SankeyExtraProperties {
  color?: string;
  path?: string;
}
export interface NodeData extends SankeyExtraProperties {
  color?: string;
  name?: string;
  label?: LabelProperties;
}
export enum ALIGNMENT {
  CENTER = "Center",
  LEFT = "Left",
  RIGHT = "Right",
  JUSTIFY = "Justify"
}
export type Link = SankeyLink<NodeData, LinkData>;
export type Node = SankeyNode<NodeData, LinkData>;
export type Graph = SankeyGraph<NodeData, LinkData>;
