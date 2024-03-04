import React from 'react'
import styled from 'styled-components'

type IProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

const Checkbox = (props: IProps) => {
  const {label} = props

  return (
    <Label>
      <CustomCheckbox
        {...props}
        type="checkbox"
      />
      {label}
    </Label>
  )
}

export default Checkbox

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 1.1em;
  gap: 4px;
  cursor: pointer;

  &:disabled, &[disabled] {
    cursor: not-allowed;
  }
`

const CustomCheckbox = styled.input`
  width: 26px;
  height: 26px;
  accent-color: #D8E2DC;
  border-radius: 2px;
  cursor: pointer;

  &:disabled, &[disabled] {
    cursor: not-allowed;
  }
`
