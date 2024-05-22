import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleSaveClick() {
    setLoading(true);
    axios
      .post("/api/board/add", { title, content, writer })
      .then(() => {
        toast({
          status: "success",
          description: "게시글이 등록되었습니다.",
          position: "top-right",
          duration: 2000,
        });
        navigate("/");
      })
      .catch((err) => {
        const code = err.response.status;
        if (code === 400) {
          toast({
            status: "error",
            description: "등록되지 않았습니다. 다시 확인해 주세요.",
            position: "top-right",
            duration: 2000,
          });
        }
      })
      .finally(() => setLoading(false));
  }

  let disableSaveButton = false;
  if (title.trim().length === 0) {
    disableSaveButton = true;
  }
  if (content.trim().length === 0) {
    disableSaveButton = true;
  }
  if (writer.trim().length === 0) {
    disableSaveButton = true;
  }

  return (
    <Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Input onChange={(e) => setContent(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input onChange={(e) => setWriter(e.target.value)} />
          </FormControl>
        </Box>

        <Box>
          <Button
            isLoading={loading}
            colorScheme={"blue"}
            isDisabled={disableSaveButton}
            onClick={handleSaveClick}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
