import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LightModeIcon from "@mui/icons-material/LightMode";
import LoopIcon from "@mui/icons-material/Loop";
import {
  Box,
  Button,
  Card,
  Collapse,
  Grid2,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import csvtojson from "csvtojson";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { spots } from "../../utils/constants";
import { Data } from "../../utils/types";
import useInterval from "../../hooks/useInterval";

// TODO: update automatically
export default function Device() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<Data[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/data/data${id}.csv`);
      setData(
        await csvtojson({
          noheader: true,
          headers: ["id", "date", "illuminance", "mdStatus"],
          colParser: { id: "number", illumiance: "number", mdStatus: "number" },
        }).fromString(await res.text())
      );
    })();
  }, [updateCounter]);

  useInterval(() => setUpdateCounter((prev) => ++prev), 10);

  if (!id || !data) {
    return <></>;
  }

  const latestData = data[data.length - 1];

  return (
    <Box
      sx={{
        background: grey["300"],
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card sx={{ mx: "auto", p: 8 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
              back to home
            </Button>
            <Button
              variant="outlined"
              startIcon={<LoopIcon />}
              onClick={() => setUpdateCounter((prev) => ++prev)}
            >
              update
            </Button>
          </Stack>
          <Typography variant="h4">
            SPOT: {spots[Number(id)]} (ID={id})
          </Typography>
          <Typography variant="h6">Last received: {latestData.date}</Typography>
          <Grid2 container spacing={4}>
            <Grid2
              size={6}
              container
              alignItems="center"
              textAlign="center"
              sx={{ p: 4 }}
            >
              <Grid2 size={12}>
                <Typography variant="h5" textAlign="left">
                  Illuminance:
                </Typography>
              </Grid2>
              <Grid2 size={6}>
                <LightModeIcon sx={{ fontSize: 128, color: "orange" }} />
              </Grid2>
              <Grid2 size={6}>
                <Typography fontSize={64}>
                  {latestData.illuminance} [lux]
                </Typography>
              </Grid2>
            </Grid2>
            <Grid2
              size={6}
              container
              alignItems="center"
              textAlign="center"
              sx={{ p: 4 }}
            >
              <Grid2 size={12}>
                <Typography variant="h5" textAlign="left">
                  Human Detected:
                </Typography>
              </Grid2>
              <Grid2 size={6}>
                <DirectionsRunIcon sx={{ fontSize: 128, color: "green" }} />
              </Grid2>
              <Grid2 size={6}>
                <Typography fontSize={64}>
                  {latestData.mdStatus ? "Yes" : "No"}
                </Typography>
              </Grid2>
            </Grid2>
          </Grid2>
          <Button
            fullWidth
            startIcon={
              !isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />
            }
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {!isOpen ? "see all data" : "close"}
          </Button>
        </Stack>
        <Collapse in={isOpen}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Illuminance [lux]</TableCell>
                  <TableCell align="center">Human Detected</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(({ date, illuminance, mdStatus }, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {date}
                    </TableCell>
                    <TableCell align="right">{illuminance}</TableCell>
                    <TableCell align="center">
                      {mdStatus ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Card>
    </Box>
  );
}
