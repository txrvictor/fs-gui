import { forwardRef, KeyboardEvent, ChangeEvent, InputHTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onEnter'> & {
  onChange: (value: string) => void
  onEnter?: () => void
}

const Input = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  const {onChange, onEnter, ...rest} = props

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onEnter && e.key === 'Enter') {
      onEnter()
    }
  }

  return (
    <CustomInput
      ref={ref}
      type="text"
      autoComplete="off"
      onChange={onValueChange}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  )
})

export default Input

const CustomInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 1.1em;
  border: 1px solid #D8E2DC;
  border-radius: 4px;
  padding: 12px 20px;

  ::placeholder {
    color: #B2B2B2;
    opacity: 1;
  }
  ::-ms-input-placeholder {
    color: #B2B2B2;
  }  
`
