import Select, {Props} from 'react-select'

const SearchSelector = (props: Props) => {
  const {...rest} = props

  return (
    <Select
      {...rest}
      isSearchable
      styles={customStyles}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          ...colors,
        }
      })}
    />
  )
}

export default SearchSelector

const colors = {
  primary: '#B0BAA4',
  primary75: '#D8E2DC',
  primary50: '#E8E8E4',
  primary25: '#E8E8E4',
}

const customStyles = {
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided: any) => ({
    ...provided,
    fontSize: '1.1em',
    '& > div > label': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  }),
  control: (provided: any) => ({
    ...provided,
    fontFamily: 'Arial',
    padding: 0,
    border: '1px solid #D8E2DC',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '12px 20px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
}
