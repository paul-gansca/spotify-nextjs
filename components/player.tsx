import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from "@chakra-ui/react";
import ReactHowler from "react-howler";
import { useEffect, useRef, useState } from "react";
import {
  MdShuffle,
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlineRepeat,
  MdPauseCircleFilled,
} from "react-icons/md";
import { useStoreActions } from "easy-peasy";
import { formatTime } from "../lib/formatters";

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [index, setIndex] = useState(
    songs.findIndex((s) => s.id === activeSong.id)
  );
  const [seek, setSeek] = useState(0.0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const soundRef = useRef(null);
  const repeatRef = useRef(repeat);
  const setActiveSong = useStoreActions((state: any) => state.changeActiveSong);

  useEffect(() => {
    let timerId;

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek());
        timerId = requestAnimationFrame(f);
      };
      timerId = requestAnimationFrame(f);
      return () => cancelAnimationFrame(timerId);
    }

    cancelAnimationFrame(timerId);
  }, [playing, isSeeking]);

  useEffect(() => {
    setActiveSong(songs[index]);
  }, [index, setActiveSong, songs]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  const setPlayState = (value) => {
    setPlaying(value);
  };

  const onShuffle = () => {
    setShuffle((state) => !state);
  };

  const onRepeat = () => {
    setRepeat((state) => !state);
  };

  const prevSong = () => {
    setIndex((state) => (state > 0 ? state - 1 : songs.length - 1));
  };

  const nextSong = () => {
    setIndex((state) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length);
        if (next === state) {
          return nextSong();
        }
        return next;
      }
      return state === songs.length - 1 ? 0 : state + 1;
    });
  };

  const onEnd = () => {
    if (repeatRef.current) {
      setSeek(0);
      soundRef.current.seek(0);
    } else {
      nextSong();
    }
  };

  const onLoad = () => {
    const songDuration = soundRef.current.duration();
    setDuration(songDuration);
  };

  const onSeek = (e) => {
    setSeek(parseFloat(e[0]));
    soundRef.current.seek(e[0]);
  };
  return (
    <Box>
      <Box>
        <ReactHowler
          ref={soundRef}
          playing={playing}
          src={activeSong?.url}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            outline="none"
            aria-label="shuffle"
            variant="link"
            fontSize="24px"
            color={shuffle ? "white" : "gray.600"}
            onClick={onShuffle}
            icon={<MdShuffle />}
          />
          <IconButton
            outline="none"
            aria-label="skip"
            variant="link"
            fontSize="24px"
            onClick={prevSong}
            icon={<MdSkipPrevious />}
          />
          {playing ? (
            <IconButton
              outline="none"
              aria-label="pause"
              variant="link"
              fontSize="40px"
              icon={<MdPauseCircleFilled />}
              onClick={() => setPlayState(false)}
            />
          ) : (
            <IconButton
              outline="none"
              aria-label="play"
              variant="link"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlayState(true)}
            />
          )}

          <IconButton
            outline="none"
            aria-label="next"
            variant="link"
            fontSize="24px"
            onClick={nextSong}
            icon={<MdSkipNext />}
          />
          <IconButton
            outline="none"
            aria-label="repeat"
            variant="link"
            fontSize="24px"
            color={repeat ? "white" : "gray.600"}
            onClick={onRepeat}
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>

      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="x-small">{formatTime(seek)}</Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={["min", "max"]}
              step={0.1}
              min={0}
              max={duration ? duration.toFixed(2) : 0}
              onChange={onSeek}
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
              id="player-range"
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%" textAlign="right">
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
