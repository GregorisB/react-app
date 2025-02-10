export type VideoEffect =
  | FilterEnum.None
  | FilterEnum.Grayscale
  | FilterEnum.Sepia
  | FilterEnum.Blur
  | FilterEnum.Invert
  | FilterEnum.Cartoon
  | FilterEnum.Pixel
  | FilterEnum.Rainbow
  | FilterEnum.Dog
  | FilterEnum.Cat
  | FilterEnum.Robot
  | FilterEnum.Mouse;

export interface PeerConnection {
  peerId: string;
  stream: MediaStream;
  effect: VideoEffect;
}

export interface CharacterOverlay {
  url: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export enum FilterEnum {
  None = "none",
  Grayscale = "grayscale",
  Sepia = "sepia",
  Blur = "blur",
  Invert = "invert",
  Cartoon = "cartoon",
  Pixel = "pixel",
  Rainbow = "rainbow",
  Dog = "character-dog",
  Cat = "character-cat",
  Robot = "character-robot",
  Mouse = "character-mouse",
}

interface Position {
  x: number;
  y: number;
}

interface BaseLayer {
  visible: boolean;
  zIndex: number;
  opacity: number;
  filter: string;
  position: Position;
}

interface ImageLayer extends BaseLayer {
  type: "image";
  content: string; // URL or base64 string
}

interface TextLayer extends BaseLayer {
  type: "text";
  content: string; // The actual text to render
}

export type Layer = ImageLayer | TextLayer;
