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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const { id } = useParams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(id);
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "해당 회원이 없습니다.",
          position: "top-right",
          duration: 1000,
        });
        navigate("/");
      });
  }, []);

  if (member == null) {
    <Spinner />;
  }

  return (
    <Box>
      <Box>{member.id}번 회원</Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input defaultValue={member.email} readOnly />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input defaultValue={member.password} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input defaultValue={member.nickName} />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input disabled={true} value={member.inserted} />
        </FormControl>
      </Box>

      <Box>
        <Button onClick={onOpen} colorScheme={"red"}>
          수정
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
                <Input onChange={(e) => setOldPassword(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={"red"}>확인</Button>
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
