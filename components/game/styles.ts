import styled from "styled-components";
import {StyledCellProps} from "./componentTypes";
import {cellColors} from "./colors";

export const StyledCell = styled.div<StyledCellProps>`
  background-color: ${(props) => cellColors[props.cell]};
  ${(props) => props.isPossible ? `
    :hover {
      opacity: 0.5;
      cursor: pointer;
      background-color: ${cellColors[props.currentPlayer]};
    }
  ` : ''}
  width: 5em;
  height: 5em;
  border: solid black 1px;
`;

export const Row = styled.div`
  display: flex;
  flex-flow: row;
`;