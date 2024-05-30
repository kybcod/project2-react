import { Box, Button, Flex, Spacer, useToast } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function CommentItem({ comment, isProcessing, setIsProcessing }) {
  const toast = useToast();

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
      .finally(() => setIsProcessing(false));
  }

  return (
    <Box>
      <Box border={"1px solid black"} my={3}>
        <Flex>
          <Box>{comment.nickName}</Box>
          <Spacer />
          <Box>{comment.inserted}</Box>
        </Flex>
        <Flex>
          <Box>{comment.comment}</Box>
          <Spacer />
          <Box>
            <Button
              isLoading={isProcessing}
              colorScheme="red"
              onClick={handleRemoveClick}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
