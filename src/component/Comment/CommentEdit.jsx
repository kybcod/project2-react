import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import axios from "axios";

export function CommentEdit({
  comment,
  isProcessing,
  setIsProcessing,
  setIsEditing,
}) {
  const [commentText, setCommentText] = useState(comment.comment);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function handleCommentSubmit() {
    setIsProcessing(true);
    axios
      .put("/api/comment/edit", {
        id: comment.id,
        comment: commentText,
      })
      .then((res) => {
        toast({
          description: "수정되었습니다.",
          position: "top",
          status: "success",
          duration: 1000,
        });
      })
      .catch()
      .finally(() => {
        onClose();
        setIsProcessing(false);
        setIsEditing(false);
      });
  }

  return (
    <Flex>
      <Box flex={1} mr={3}>
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </Box>
      <Stack>
        <Button
          size={"sm"}
          variant={"outline"}
          colorScheme={"gray"}
          onClick={() => setIsEditing(false)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <Button
          size={"sm"}
          isLoading={isProcessing}
          onClick={onOpen}
          variant={"outline"}
          colorScheme={"blue"}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </Stack>
      <Modal isOpen={isOpen} onClose={onclose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalBody>정말로 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button colorScheme={"gray"} onClick={onClose}>
              취소
            </Button>
            <Button mr={2} colorScheme={"blue"} onClick={handleCommentSubmit}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
