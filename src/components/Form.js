import { useState, useEffect } from 'react';

import CustomAutoComplete from './CustomAutoComplete'

function Table() {
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [entities, setEntities] = useState([]);

  const [city, setCity] = useState({});
  const [district, setDistrict] = useState({});
  const [job, setJob] = useState({});
  const [entity, setEntity] = useState({});

  const externalApiBaseUrl = 'http://lb-aws-1105894158.sa-east-1.elb.amazonaws.com'

  const isObjectEmpty = (obj) => {
    return !Object.keys(obj).length
  }

  useEffect(() => {
    fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
    ).then(response => response.json())
    .then(data => setDistricts(data));
  }, [])

  useEffect(() => {
    if (isObjectEmpty(district)) {
      setCities([])
    } else {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${district.sigla}/municipios?orderBy=nome`
      ).then(response => response.json())
      .then(data => setCities(data));
    }
  }, [district])

  useEffect(() => {
    if (isObjectEmpty(city) || isObjectEmpty(district)) {
      setJobs([])
    } else {
      const cityUrlParam = encodeURI(city.nome.toUpperCase())

      fetch(
        `${externalApiBaseUrl}/profissao/${district.sigla}/${cityUrlParam}?api-key=ddd70c32-fc98-4618-b494-a9698f824353`
      ).then(response => response.json())
      .then(data => setJobs(data));
    }
  }, [city, district])

  useEffect(() => {
    if (isObjectEmpty(city) || isObjectEmpty(district) || isObjectEmpty(job)) {
      setEntities([])
    } else {
      const cityUrlParam = encodeURI(city.nome.toUpperCase())
      const jobUrlParam = encodeURI(job.profissao)

      fetch(
        `${externalApiBaseUrl}/entidade/${jobUrlParam}/${district.sigla}/${cityUrlParam}?api-key=4b94dba2-5524-4632-939b-92df1c50a645`
      ).then(response => response.json())
      .then(data => setEntities(data));
    }
  }, [city, district, job])

  return (
    <>
      <CustomAutoComplete
        options={districts}
        getOptionLabel={(option) => option.sigla ? `${option.sigla} - ${option.nome}` : ''}
        value={district}
        updateState={setDistrict}
        name="Estado"
      />

      <CustomAutoComplete
        options={cities}
        getOptionLabel={(option) => option.nome || '' }
        value={city}
        updateState={setCity}
        name="Cidade"
      />

      <CustomAutoComplete
        options={jobs}
        getOptionLabel={(option) => option.profissao || '' }
        value={job}
        updateState={setJob}
        name="Profissão"
      />

      <CustomAutoComplete
        options={entities}
        getOptionLabel={(option) => option.NomeFantasia ? `${option.NomeFantasia} - ${option.RazaoSocial}` : ''}
        value={entity}
        updateState={setEntity}
        name="Entidade"
      />
    </>
  );
}

export default Table;
