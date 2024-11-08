// ============================================================================================
// JSON BOUNDARY
// ============================================================================================
// AUTHOR       : Ashikur Rahman
// DESCRIPTION  : A simple NPM package to get boundary indexes from JSON string or normal string easily and faster.
// Date         : Thursday, 07 -November-2024 (20:54:57)
// ============================================================================================

export type boundarySetupType = {
  mileStones?: string;
  ignoreCharSet?: string;
  boundaries?: { [key: string]: string };
};

export type boudaryType = {
  start: number;
  end: number;
};

const initSetup: boundarySetupType = {
  mileStones: "!:=@<->^?*$#",
  ignoreCharSet: ";&|",
  boundaries: {
    "[": "]",
    "{": "}",
    '"': '"',
    "'": "'",
  },
};

export default class JsonBoundary {
  private mileStones; // Mile stones tell to start finding boundaries.
  private ignoreCharSet; // Ignore Char inspire to find new mileStone again to start the finding operation.
  private boundaries; // Boundaries tell to find boundaries between these characters.
  private boundarySet; // Set of boundary characters. it just for coding.

  /**
   * Initialize setup with default values if not provided.
        defaultSetup={
            mileStones: "!:=@<->^?*$#",
            ignoreCharSet: ";&|",
            boundaries: {
                "[": "]",
                "{": "}",
                '"': '"',
                "'": "'",
            }
        }
   * @returns boundaryIndexes   * 
   *
  *********************************************************************** Constructor for Json Boundary */
  constructor(setUp?: boundarySetupType) {
    setUp = { ...initSetup, ...setUp };

    this.mileStones = new Set(setUp.mileStones!.split(""));
    this.ignoreCharSet = new Set(setUp.ignoreCharSet!.split(""));
    this.boundaries = setUp.boundaries;
    this.boundarySet = new Set(Object.keys(setUp.boundaries!));
  }

  /*********************************************************************** Get boundary indexes */
  getBoundaries(str: string): boudaryType[] {
    const boundaryIndexes: boudaryType[] = [];

    let startIndex = 0;
    let captureBoundary = false;
    let identifier: string = "";
    let ignore = 0;

    let i = 0;

    while (i < str.length) {
      /********************************************************************** when we found a mileStone */
      if (this.mileStones.has(str[i])) captureBoundary = true;
      else if (this.ignoreCharSet.has(str[i])) captureBoundary = false;
      else captureBoundary = true;

      //********************************************************************* boundary capturing start */
      if (captureBoundary) {
        //******************************************************************* if nothing to ignore */
        if (!ignore && this.boundarySet.has(str[i])) {
          identifier = str[i];
          startIndex = i;
          ignore++;
        }

        //******************************************************************* when found ignore case then */
        else {
          //***************************************************************** If a boundary ended */
          if (str[i] == this.boundaries![identifier] && str[i - 1] != "\\") {
            ignore--;
          }

          //***************************************************************** If new boundary started */
          else if (str[i] == identifier && str[i - 1] != "\\") {
            ignore++;
          }

          //****************************************************************  When get a Final boundary */
          if (!ignore) {
            boundaryIndexes.push({ start: startIndex, end: i });
            captureBoundary = false;
          }
        }
      }
      //******************************************************************** increment index i
      i++;
    }

    /*********************************************************************** return the final result */
    return boundaryIndexes;
  }
}
