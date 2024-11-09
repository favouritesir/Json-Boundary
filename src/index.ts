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

export class JsonBoundary {
  private mileStones; // Mile stones tell to start finding boundaries.
  private ignoreCharSet; // Ignore Char inspire to find new mileStone again to start the finding operation.
  private boundaries; // Boundaries tell to find boundaries between these characters.
  private boundarySet; // Set of boundary characters. it just for coding.

  private id = 0;
  private originalContents: { [keys: string]: string[] } = {};
  private identifiers: { [keys: string]: string } = {};
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

  /**
   * @param str: string
   * @returns boundaryIndexes    * 
  /*********************************************************************** Get boundary indexes */
  getBoundaries(
    str: string,
    callback?: (startIndex: number, currentIndex: number, flag: number) => void
  ): boudaryType[] {
    const boundaryIndexes: boudaryType[] = [];

    let startIndex = 0;
    let captureBoundary = false;
    let identifier: string = "";

    let i = 0;
    let flag: number = -1;

    while (i < str.length) {
      /********************************************************************** when we found a mileStone */
      if (this.mileStones.has(str[i])) captureBoundary = true;
      else if (this.ignoreCharSet.has(str[i])) captureBoundary = false;
      else captureBoundary = true;

      //********************************************************************* boundary capturing start */
      if (captureBoundary) {
        //******************************************************************* if nothing to ignore */
        if (flag <= 0) {
          if (this.boundarySet.has(str[i])) {
            identifier = str[i];
            startIndex = i;
            flag = 1;
          } else flag = -1;
        }

        //******************************************************************* when found ignore case then */
        else {
          //***************************************************************** If a boundary ended */
          if (str[i] == this.boundaries![identifier] && str[i - 1] != "\\") {
            flag--;
          }

          //***************************************************************** If new boundary started */
          else if (str[i] == identifier && str[i - 1] != "\\") {
            flag++;
          }

          //****************************************************************  When get a Final boundary */
          if (!flag) {
            boundaryIndexes.push({ start: startIndex, end: i });
            captureBoundary = false;
          }
        }
      }
      if (callback) callback(startIndex, i, flag);
      //******************************************************************** increment index i
      i++;
    }

    /*********************************************************************** return the final result */
    return boundaryIndexes;
  }

  /**
   * @param str: string, 
   * @param replacementFormate:string (input:"#{$}" output:"#1" or "#2" or ...)
   * @returns simple string without boundary contents which replace with a given formate.
  /*********************************************************************** Get boundary indexes */
  getSimple(originalStr: string, identifier: string = "###") {
    const contents: string[] = [];
    let lastEndPoint = 0;
    const result: { id: number; str: string; boundaries: boudaryType[] } = {
      id: this.id++,
      str: "",
      boundaries: [],
    };

    result.boundaries = this.getBoundaries(originalStr, (start, end, flag) => {
      if (flag != 0) return; // return if boundary is still capturing or not found.
      /********************************************************************** when boundary ends push the simple string */
      result.str += `${originalStr.substring(
        lastEndPoint,
        start
      )}${identifier}`;

      /********************************************************************** collect the boundary contents */
      contents.push(originalStr.substring(start, end + 1));
      lastEndPoint = end + 1; // update the last end point
    });

    /********************************************************************** complete the string */
    result.str += originalStr.substring(lastEndPoint);
    /********************************************************************** save the content collections */
    this.originalContents[result.id] = contents;
    this.identifiers[result.id] = identifier;

    return result;
  }
  /**
   * @param id: number
   * @returns simple string without boundary contents which replace with a given formate.
  /***********************************************************************  */
  replaceOriginal(modifiedStr: string, id: number) {
    const regex = new RegExp(`${this.identifiers[id]}`, "g");
    let contentIndex = 0;

    return modifiedStr.replace(
      regex,
      (_) => this.originalContents[id][contentIndex++]
    );
  }
}
