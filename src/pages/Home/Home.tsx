import { Box, Card, IconButton, Popper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoomIcon from "@mui/icons-material/Room";
import { MouseEvent, useEffect, useState } from "react";
import { Data } from "../../utils/types";
import csvtojson from "csvtojson";
import useInterval from "../../hooks/useInterval";

export default function Home() {
  const navigate = useNavigate();

  function handleClick(id: number) {
    return () => {
      navigate(`/device/${id}`);
    };
  }

  const [dataArray, setDataArray] = useState<Data[][]>([[], [], [], []]);
  const [updateCounter, setUpdateCounter] = useState(0);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dataId, setDataId] = useState(0);
  function handleMouseEnter(id: number) {
    return (e: MouseEvent<HTMLElement>) => {
      setOpen(true);
      setAnchorEl(e.currentTarget);
      setDataId(id);
    };
  }

  function handleMouseLeave(id: number) {
    return () => {
      setOpen(false);
      setAnchorEl(null);
      setDataId(id);
    };
  }

  useEffect(() => {
    const temp: Data[][] = [];
    (async () => {
      for await (const i of [0, 1, 2, 3]) {
        const res = await fetch(`/data/data${i}.csv`);
        const data = await csvtojson({
          noheader: true,
          headers: ["id", "date", "illuminance", "mdStatus"],
          colParser: { id: "number", illumiance: "number", mdStatus: "number" },
        }).fromString(await res.text());
        temp.push(data);
      }
      setDataArray(temp);
    })();
  }, [updateCounter]);

  useInterval(() => setUpdateCounter((prev) => ++prev), 10);

  if (!dataArray[0] || dataArray[0].length === 0) {
    return <>error</>;
  }

  return (
    <Box sx={{ py: 4 }} textAlign="center">
      <Typography variant="h3">IoT Monitoring</Typography>
      <Box
        sx={{
          mx: "auto",
          backgroundImage: `url(/map.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          maxWidth: "32rem",
          height: "42rem",
        }}
        textAlign="left"
      >
        <Popper open={open} anchorEl={anchorEl}>
          <Card sx={{ p: 2 }}>
            <Typography>
              {dataArray[dataId][dataArray[dataId].length - 1].illuminance}{" "}
              [lux]
            </Typography>
          </Card>
        </Popper>
        <IconButton
          sx={{ position: "relative", top: "22%", left: "84%" }}
          onClick={handleClick(0)}
          onMouseEnter={handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave(0)}
        >
          <RoomIcon
            sx={{
              fontSize: 48,
              color: !!dataArray[0][dataArray[0].length - 1].mdStatus
                ? "red"
                : "grey",
            }}
          />
        </IconButton>
        <IconButton
          sx={{ position: "relative", top: "78%", left: "13%" }}
          onClick={handleClick(1)}
          onMouseEnter={handleMouseEnter(1)}
          onMouseLeave={handleMouseLeave(1)}
        >
          <RoomIcon
            sx={{
              fontSize: 48,
              color: !!dataArray[1][dataArray[1].length - 1].mdStatus
                ? "red"
                : "grey",
            }}
          />
        </IconButton>
        <IconButton
          sx={{ position: "relative", top: "7%", left: "42%" }}
          onClick={handleClick(2)}
          onMouseEnter={handleMouseEnter(2)}
          onMouseLeave={handleMouseLeave(2)}
        >
          <RoomIcon
            sx={{
              fontSize: 48,
              color: !!dataArray[2][dataArray[2].length - 1].mdStatus
                ? "red"
                : "grey",
            }}
          />
        </IconButton>
        <IconButton
          sx={{ position: "relative", top: "19%", left: "-5%" }}
          onClick={handleClick(3)}
          onMouseEnter={handleMouseEnter(3)}
          onMouseLeave={handleMouseLeave(3)}
        >
          <RoomIcon
            sx={{
              fontSize: 48,
              color: !!dataArray[3][dataArray[3].length - 1].mdStatus
                ? "red"
                : "grey",
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
}
