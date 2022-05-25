import { Box, Flex, Text } from "@chakra-ui/layout";
import { useStoreState } from "easy-peasy";
import Player from "./player";

const PlayerBar = () => {
  const songs = useStoreState((state: any) => state.activeSongs);
  const activeSong = useStoreState((state: any) => state.activeSong);
  return (
    <Box height="100px" width="100vw" bg="gray.900" padding="10px">
      <Flex align="center">
        {activeSong && (
          <Box width="30%" padding="20px" color="white">
            <Text fontSize="size">{activeSong.name}</Text>
            <Text fontSize="small">{activeSong.artist.name}</Text>
          </Box>
        )}
        {activeSong && (
          <Box width="40%" color="white">
            <Player songs={songs} activeSong={activeSong} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default PlayerBar;
