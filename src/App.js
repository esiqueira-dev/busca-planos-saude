import { Container, Divider } from "@material-ui/core";
import { useState } from "react";
import Form from "./components/Form"
import PlanList from "./components/PlanList"

function App() {
  const [healthInsurancePlans, setHealthInsurancePlans] = useState([])

  return (
    <Container maxWidth="lg" className="health-insurance-page">
      <Form setHealthInsurancePlans={setHealthInsurancePlans} />
      {healthInsurancePlans.length ? (
        <>
          <Divider id="divider" />
          <PlanList healthInsurancePlans={healthInsurancePlans} />
        </>
      ) : (<></>)}
    </Container>
  );
}

export default App;
