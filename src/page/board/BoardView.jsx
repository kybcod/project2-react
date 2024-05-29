import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);
  const [ani1, setAni1] = useState(false);
  const [like, setLike] = useState({ like: false, count: 0 });

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => setBoard(res.data))
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

  // if (board === null) {
  //   return <Spinner />;
  // }

  return (
    <Box mt={"30px"}>
      <Flex>
        <Heading>{board.id}번 게시물</Heading>
        <Spacer />
        <Flex>
          <Box
            fontSize={"3xl"}
            onClick={() => {
              setLike({ ...like, like: !like.like });
              setAni1(true);
            }}
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
          <Box fontSize={"3xl"}>{like.count}</Box>
        </Flex>
      </Flex>
      <Box mt={"30px"}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly />
        </FormControl>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Input value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box display={"flex"} flexWrap={"wrap"} mt={"30px"}>
          {board.fileList &&
            board.fileList.map((file) => (
              <Box
                boxSize={"190px"}
                border={"2px solid black"}
                m={3}
                key={file.name}
              >
                <Center>
                  <Image
                    borderRadius={"full"}
                    boxSize={"180px"}
                    src={file.src}
                  />
                </Center>
              </Box>
            ))}
        </Box>

        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.writer} readOnly />
          </FormControl>
        </Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            <Input type={"datetime-local"} value={board.inserted} readOnly />
          </FormControl>
        </Box>
        {account.hasAccess(board.memberId) && (
          <Box mt={"30px"}>
            <Button
              colorScheme={"purple"}
              onClick={() => navigate(`/edit/${board.id}`)}
            >
              수정
            </Button>
            <Button colorScheme={"red"} onClick={onOpen}>
              삭제
            </Button>
          </Box>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme={"red"} onClick={handleClickRemove}>
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
