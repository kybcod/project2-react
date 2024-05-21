import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState({});

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data));
  }, []);

  // if (board === null) {
  //   return <Spinner />;
  // }

  return (
    <Box>
      <Box>{board.id}번 게시물</Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly />
        </FormControl>
        <Box>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Input value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.writer} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            <Input type={"datetime-local"} value={board.inserted} readOnly />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
