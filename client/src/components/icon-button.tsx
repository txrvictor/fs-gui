import styled from 'styled-components'

interface Props {
  icon: string
  onClick: () => void
  highlight?: boolean
  alt?: string
}

const IconButton = (props: Props) => {
  const {icon, alt, highlight, onClick} = props

  return (
    <Button onClick={onClick} title={alt} $highlight={highlight}>
      <Icon src={icon} alt={alt} />
    </Button>
  )
}

export default IconButton


const Button = styled.button<{$highlight?: boolean}>`
  background-color: ${props => (props.$highlight ? `#FFDFC8` : `transparent`)};
  border: none;
  cursor: pointer;
  padding: 0.2em;
  margin: 0;
  transition: box-shadow 0.3s ease; 

  &:hover {
    background-color: #E8E8E4;
    box-shadow: -2px 2px 1px 0px rgba(0,0,0,0.1);
  }
  &:focus {
    border: none;
    outline: none;
  }
`

const Icon = styled.img`
  height: 1.8em;
`
