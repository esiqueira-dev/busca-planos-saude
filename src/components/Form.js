import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState, useEffect } from "react";

import CustomAutoComplete from "./CustomAutoComplete";

function Form({ setHealthInsurancePlans }) {
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [entities, setEntities] = useState([]);

  const [city, setCity] = useState({});
  const [district, setDistrict] = useState({});
  const [job, setJob] = useState({});
  const [entity, setEntity] = useState({});
  const [birthDay, setBirthDay] = useState("");

  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const externalApiBaseUrl =
    "http://lb-aws-1105894158.sa-east-1.elb.amazonaws.com";

  const isObjectEmpty = (obj) => {
    return !Object.keys(obj).length;
  };

  const isDateValid = (date) => {
    const validDateRegEx = /^\d{4}-\d{2}-\d{2}$/;
    return !!date.match(validDateRegEx);
  };

  const formIsValid = () => {
    if (
      isObjectEmpty(city) ||
      isObjectEmpty(district) ||
      isObjectEmpty(job) ||
      isObjectEmpty(entity) ||
      !isDateValid(birthDay)
    ) {
      return false;
    }

    return true;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formIsValid()) {
      setLoading(true);
      const data = {
        entidade: entity.NomeFantasia,
        uf: district.sigla,
        cidade: city.nome,
        datanascimento: [birthDay],
      };

      fetch(
        `${externalApiBaseUrl}/plano?api-key=261fd4d0-fd9f-468a-afa9-f5a89ed3701c`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setHealthInsurancePlans(data.planos);
          console.log(data.planos)
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } else {
      setAlertMessage("Favor preencher completamente o formulário");
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    setLoading(true);

    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setDistricts(data);
      });
  }, []);

  useEffect(() => {
    if (isObjectEmpty(district)) {
      setCities([]);
      setCity({});
    } else {
      setLoading(true);

      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${district.sigla}/municipios?orderBy=nome`
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setCities(data);
        });
    }
  }, [district]);

  useEffect(() => {
    if (isObjectEmpty(city) || isObjectEmpty(district)) {
      setJobs([]);
      setJob({});
    } else {
      setLoading(true);
      const cityUrlParam = encodeURI(city.nome.toUpperCase());

      fetch(
        `${externalApiBaseUrl}/profissao/${district.sigla}/${cityUrlParam}?api-key=ddd70c32-fc98-4618-b494-a9698f824353`
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setJobs(data);
        });
    }
  }, [city, district]);

  useEffect(() => {
    if (isObjectEmpty(city) || isObjectEmpty(district) || isObjectEmpty(job)) {
      setEntities([]);
      setEntity({});
    } else {
      setLoading(true);

      const cityUrlParam = encodeURI(city.nome.toUpperCase());
      const jobUrlParam = encodeURI(job.profissao);

      fetch(
        `${externalApiBaseUrl}/entidade/${jobUrlParam}/${district.sigla}/${cityUrlParam}?api-key=4b94dba2-5524-4632-939b-92df1c50a645`
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setEntities(data);
        });
    }
  }, [city, district, job]);

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Backdrop open={loading} className="backdrop">
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleClose}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <CustomAutoComplete
            options={districts}
            getOptionLabel={(option) =>
              option.sigla ? `${option.sigla} - ${option.nome}` : ""
            }
            value={district}
            updateState={setDistrict}
            name="Estado"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <CustomAutoComplete
            options={cities}
            getOptionLabel={(option) => option.nome || ""}
            value={city}
            updateState={setCity}
            name="Cidade"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <CustomAutoComplete
            options={jobs}
            getOptionLabel={(option) => option.profissao || ""}
            value={job}
            updateState={setJob}
            name="Profissão"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <CustomAutoComplete
            options={entities}
            getOptionLabel={(option) =>
              option.NomeFantasia
                ? `${option.NomeFantasia} - ${option.RazaoSocial}`
                : ""
            }
            value={entity}
            updateState={setEntity}
            name="Entidade"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <FormControl className="health-insurance-form-input">
            <TextField
              label="Data de nascimento"
              type="date"
              variant="outlined"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="health-insurance-form-button"
          >
            Buscar Resultados
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default Form;
