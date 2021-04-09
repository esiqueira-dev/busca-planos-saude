import { Container } from "@material-ui/core";
import Form from "./components/Form"

function App() {
  return (
    <Container maxWidth="lg">
      <form noValidate autoComplete="off">
        <Form />
      </form>
    </Container>
  );
}

export default App;
