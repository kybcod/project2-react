import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentComponent } from "../../component/Comment/CommentComponent.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);
  const [ani1, setAni1] = useState(false);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data.board);
        setLike(res.data.like);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "해당 게시물이 존재하지 않습니다.",
            position: "bottom-right",
          });
          navigate("/");
        }
      });
  }, []);

  function handleClickRemove() {
    axios
      .delete(`/api/board/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 삭제되었습니다.`,
          position: "bottom-right",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: `${id}번 게시물 삭제 중 오류가 발생하였습니다.`,
          position: "bottom-right",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  if (board === null) {
    return <Spinner />;
  }

  function handleClickLike() {
    if (!account.isLoggedIn()) {
      return;
    }
    setIsLikeProcessing(true);
    axios
      .put(`/api/board/like`, { boardId: board.id })
      .then((res) => {
        setLike(res.data);
        setAni1(true);
      })
      .catch()
      .finally(setIsLikeProcessing(false));
  }

  return (
    <Box mt={"30px"}>
      <Box mb={10}>
        <Flex>
          <Heading mb={7}>{board.id}번 게시물</Heading>
          <Spacer />
          {isLikeProcessing || (
            <Flex>
              <Tooltip
                isDisabled={account.isLoggedIn()}
                hasArrow
                label={"로그인 해주세요"}
              >
                <Box
                  fontSize={"3xl"}
                  cursor="pointer"
                  onClick={handleClickLike}
                >
                  {like.like && (
                    <FontAwesomeIcon
                      onMouseLeave={() => setAni1(false)}
                      icon={fullHeart}
                      bounce={ani1}
                      style={{ color: "#B197FC" }}
                      cursor={"pointer"}
                    />
                  )}
                  {like.like || (
                    <FontAwesomeIcon
                      onMouseLeave={() => setAni1(false)}
                      icon={emptyHeart}
                      bounce={ani1}
                      style={{ color: "#B197FC" }}
                      cursor={"pointer"}
                    />
                  )}
                </Box>
              </Tooltip>
              <Box mx={3} fontSize="3xl">
                {like.count}
              </Box>
            </Flex>
          )}
          {isLikeProcessing && (
            <Box pr={3}>
              <Spinner color="#B197FC" />
            </Box>
          )}
        </Flex>
      </Box>

      <Box mb={7}>
        <Box mb={7}>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={board.title} readOnly />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Input value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box mb={7}>
          <Box display={"flex"} flexWrap={"wrap"} mt={"30px"}>
            {board.fileList &&
              board.fileList.map((file) => (
                <Card m={3} key={file.name}>
                  <CardBody>
                    <Image w={"100%"} boxSize={"180px"} src={file.src} />
                  </CardBody>
                </Card>
              ))}
          </Box>
        </Box>

        <Box mb={7}>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.writer} readOnly />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            <Input type={"datetime-local"} value={board.inserted} readOnly />
          </FormControl>
        </Box>
        {account.hasAccess(board.memberId) && (
          <Flex mb={7} gap={2}>
            <Box mt={"30px"}>
              <Button
                w={"100px"}
                mr={5}
                colorScheme={"purple"}
                onClick={() => navigate(`/edit/${board.id}`)}
              >
                수정
              </Button>
              <Button w={"100px"} colorScheme={"red"} onClick={onOpen}>
                삭제
              </Button>
            </Box>
          </Flex>
        )}

        <Box mb={20}>
          <CommentComponent boardId={board.id} />
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Flex gap={2}>
                <Button onClick={onClose}>취소</Button>
                <Button colorScheme={"red"} onClick={handleClickRemove}>
                  확인
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
