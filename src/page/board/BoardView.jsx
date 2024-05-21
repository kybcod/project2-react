import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => setBoard(res.data))
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "해당 게시물이 존재하지 않습니다.",
            position: "top-right",
          });
          navigate("/");
        }
      });
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
