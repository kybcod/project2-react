import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: `${board.id}님의 게시글을 찾을 수 없습니다.`,
            position: "top-right",
            duration: 1000,
          });
          navigate("/");
        }
      });
  }, []);

  if (board == null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete(`/api/board/${id}`)
      .then((res) => {
        toast({
          status: "success",
          description: "게시글이 삭제되었습니다.",
          position: "top-right",
          duration: 1000,
        });
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description:
              "게시글이 삭제되지 않았습니다. 다시 한번 확인 부탁드립니다.",
            position: "top-right",
            duration: 1000,
          });
        }
      });
  }

  return (
    <Box>
      <Box>{board.id}님 게시글</Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea value={board.title}></Textarea>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.title} />
        </FormControl>
      </Box>
      <Box>
        <Button>수정</Button>
        <Button onClick={onOpen}>삭제</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>❓ 경고</ModalHeader>
            <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={handleDelete}>확인</Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
