import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  function handleSaveClick() {
    axios.post("/api/board/add", {
      title,
      content,
      writer,
    });
  }

  return (
    <Box>
      <Box>글 작성 화면</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input name={"title"} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              name={"content"}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input
              name={"writer"}
              onChange={(e) => setWriter(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <Button colorScheme={"blue"} onClick={handleSaveClick}>
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
