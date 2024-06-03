import {
  Box,
  Button,
  Center,
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
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberView() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((response) => {
        setMember(response.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "해당 회원이 존재하지 않습니다.",
            position: "bottom-right",
            duration: 1000,
          });
        }
        if (err.response.status === 403) {
          toast({
            status: "error",
            description: "접근 권한이 없습니다.",
            position: "bottom-right",
            duration: 1000,
          });
          navigate(-1); //이전하면
        }
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDeleteClick() {
    setIsLoading(true);
    axios
      .delete(`/api/member/${id}`, {
        data: { id, password },
      })
      .then((res) => {
        toast({
          status: "success",
          description: `${member.id}님이 탈퇴하였습니다. `,
          position: "bottom-right",
          duration: 1000,
        });
        account.logout();
        navigate("/");
      })
      .catch((err) => {
        toast({
          status: "error",
          description: `회원 탈퇴 중 문제가 발생하였습니다.`,
          position: "bottom-right",
          duration: 1000,
        });
      })
      .finally(() => {
        setIsLoading(false);
        setPassword("");
        onClose();
      });
  }

  return (
    <Box>
      <Center>
        <Box w={500}>
          <Box mb={10}>
            <Heading>회원 정보</Heading>
          </Box>
          <Box>
            <Box mb={7}>
              <Box mb={7}>
                <Box mb={3}>프로필 사진</Box>
                <Image boxSize={"180px"} src={member.awsProfile} />
              </Box>
            </Box>
          </Box>
          <Box mb={10}>
            <Box mb={7}>
              <FormControl>
                <FormLabel>이메일</FormLabel>
                <Input value={member.email} readOnly />
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl>
                <FormLabel>닉네임</FormLabel>
                <Input value={member.nickName} readOnly />
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl>
                <FormLabel>가입일시</FormLabel>
                <Input value={member.inserted} readOnly />
              </FormControl>
            </Box>

            {account.hasAccess(member.id) && (
              <Box>
                <Button
                  w={"100px"}
                  mr={5}
                  onClick={() => navigate(`/member/edit/${member.id}`)}
                  colorScheme={"green"}
                >
                  수정
                </Button>
                <Button w={"100px"} onClick={onOpen} colorScheme={"red"}>
                  탈퇴
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            경고
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>암호</FormLabel>
              <Input onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={2}
              isLoading={isLoading}
              colorScheme={"red"}
              onClick={handleDeleteClick}
            >
              확인
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme={"blue"}
              onClick={onClose}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
