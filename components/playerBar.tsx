import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";
import Player from "./player";

const PlayerBar = () => {
  const songs = useStoreState((state: any) => state.activeSongs);
  const activeSong = useStoreState((state: any) => state.activeSong);
  return (
    <Box height="100px" width="100vw" bg="gray.900" padding="10px">
      <Flex align="center">
        {activeSong && (
          <Box width="30%" color="white">
            <Flex align="center">
              <Box padding="10px">
                <Image
                  boxSize="60px"
                  boxShadow="2xl"
                  src={`https://picsum.photos/400?random=${activeSong.id}`}
                  borderRadius="3px"
                />
              </Box>
              <Box>
                <Text fontSize="size">{activeSong.name}</Text>
                <Text fontSize="small">{activeSong.artist.name}</Text>
              </Box>
            </Flex>
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
