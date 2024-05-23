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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";

export function MemberView() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

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
            position: "top-right",
            duration: 1000,
          });
        }
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDeleteClick() {
    setIsLoading(true);
    axios
      .delete(`/api/member/${id}`, { data: { id, password } })
      .then((res) => {
        toast({
          status: "success",
          description: `${member.id}님이 탈퇴하였습니다. `,
          position: "top-right",
          duration: 1000,
        });
        navigate("/member/list");
      })
      .catch((err) => {
        toast({
          status: "error",
          description: `올바른 비밀번호가 아닙니다.`,
          position: "top-right",
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
    <Box mt={"30px"}>
      <Box>{member.id}번 회원</Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input value={member.email} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input value={member.nickName} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input value={member.inserted} readOnly />
        </FormControl>
      </Box>

      <Box>
        <Button
          onClick={() => navigate(`/member/edit/${member.id}`)}
          colorScheme={"green"}
        >
          수정
        </Button>
        <Button onClick={onOpen} colorScheme={"red"}>
          탈퇴
        </Button>
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
                isLoading={isLoading}
                colorScheme={"red"}
                onClick={handleDeleteClick}
              >
                탈퇴
              </Button>
              <Button colorScheme={"blue"} onClick={onClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
