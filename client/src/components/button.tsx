import styled from 'styled-components'

export default styled.button`
  min-width: 94px;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #D8E2DC;
  border-radius: 8px;
  border: 2px solid transparent;
  padding: 0.6em 1.2em;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #B0BAA4;
  }

  &:disabled, &[disabled] {
    background-color: #CCCCCC;
    pointer-events: none;
    cursor: not-allowed;
  }
`
