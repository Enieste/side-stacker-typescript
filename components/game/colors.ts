import {Cell} from "./types";

type CellColors = {[key in Cell]: string};

export const cellColors: CellColors = {
  1: 'red',
  2: 'blue',
  0: 'gray',
};