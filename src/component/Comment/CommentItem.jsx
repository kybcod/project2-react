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
  Spacer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";

export function CommentItem({ comment, isProcessing, setIsProcessing }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const account = useContext(LoginContext);
  const [isEditing, setIsEditing] = useState(false);

  function handleRemoveClick() {
    setIsProcessing(true);
    axios
      .delete(`/api/comment/remove`, {
        data: { id: comment.id },
      })
      .then((res) => {
        toast({
          description: "댓글이 삭제되었습니다.",
          position: "top",
          status: "success",
          duration: 1000,
        });
      })
      .catch()
      .finally(() => {
        onClose();
        setIsProcessing(false);
      });
  }

  return (
    <Box>
      <Box border={"1px solid black"} my={3}>
        <Flex>
          <Box>{comment.nickName}</Box>
          <Spacer />
          <Box>{comment.inserted}</Box>
        </Flex>
        {isEditing || (
          <Flex>
            <Box>{comment.comment}</Box>
            <Spacer />
            {account.hasAccess(comment.memberId) && (
              <Box>
                <Button
                  colorScheme={"purple"}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
                <Button
                  isLoading={isProcessing}
                  colorScheme="red"
                  onClick={onOpen}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
              </Box>
            )}
          </Flex>
        )}

        {isEditing && (
          <CommentEdit
            comment={comment}
            setIsEditing={setIsEditing}
            setIsProcessing={setIsProcessing}
            isProcessing={isProcessing}
          />
        )}

        {account.hasAccess(comment.memberId) && (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>삭제 확인</ModalHeader>
              <ModalBody>댓글을 삭제 하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>취소</Button>
                <Button onClick={handleRemoveClick} colorScheme={"red"}>
                  확인
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Box>
  );
}
