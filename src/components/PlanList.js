import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Divider, Grid, Hidden } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "66.66%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function PlanList({ healthInsurancePlans }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const toCurrency = (price) => {
    if (price) {
      return Number(price).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    }

    return "";
  };

  return (
    <div className={classes.root}>
      {healthInsurancePlans.map((healthInsurancePlan, index) => (
        <Accordion
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-content`}
          >
            <Typography className={classes.heading}>
              {`${healthInsurancePlan.plano} - ${healthInsurancePlan.operadora}`}
            </Typography>
            <Hidden smDown>
              <Typography className={classes.secondaryHeading}>
                {toCurrency(healthInsurancePlan.precos?.total)}
              </Typography>
            </Hidden>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item md={2} sm={3} xs={12}>
                <img
                  src={healthInsurancePlan.operadoraLogo}
                  alt={healthInsurancePlan.operadora}
                  title={healthInsurancePlan.operadora}
                />
              </Grid>
              <Grid item md={4} sm={7} xs={12}>
                <Typography>
                  {healthInsurancePlan.segmentacao}
                  <br />
                  {`Acomodação: ${healthInsurancePlan.tipo_acomodacao}`}
                  <br />
                  {`Nível: ${healthInsurancePlan.nivel}`}
                  <br />
                  {`Abrangência: ${healthInsurancePlan.abrangencia}`}
                </Typography>
              </Grid>
              <Grid item md={4} sm={2} xs={12}>
                <Typography>
                  {`${healthInsurancePlan.precos.precos[0].de} - ${healthInsurancePlan.precos.precos[0].ate} anos`}
                  <br />
                  {toCurrency(healthInsurancePlan.precos?.total)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
