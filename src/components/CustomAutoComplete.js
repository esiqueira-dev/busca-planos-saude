import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function CustomAutoComplete(props) {
  const { name, value, updateState, options, getOptionLabel } = props
  return (
    <Autocomplete
        { ...props }
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={(_event, newInputValue) => {
          updateState(newInputValue || {});
        }}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={name} margin="normal" />}
      />
  )
}

export default CustomAutoComplete;