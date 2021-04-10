import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function CustomAutoComplete(props) {
  const { name, value, updateState, options, getOptionLabel } = props
  return (
    <Autocomplete
        { ...props }
        options={options}
        className="m-0"
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={(_event, newInputValue) => {
          updateState(newInputValue || {});
        }}
        renderInput={(params) => <TextField {...params} label={name} margin="normal" variant="outlined" />}
      />
  )
}

export default CustomAutoComplete;