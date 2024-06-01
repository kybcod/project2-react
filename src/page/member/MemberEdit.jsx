import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const [oldNickName, setOldNickName] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const account = useContext(LoginContext);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
        setOldNickName(member1.nickName);
        setFilePreview(member1.awsProfile);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 정보 조회 중 문제가 발생하였습니다.",
          position: "bottom-right",
        });
        navigate("/");
      });
  }, []);

  function handleClickSave() {
    axios
      .putForm("/api/member/modify", { file: file, ...member, oldPassword })
      .then((res) => {
        toast({
          status: "success",
          description: "회원 정보가 수정되었습니다.",
          position: "bottom-right",
        });
        account.login(res.data.token);
        navigate(`/member/${id}`);
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원 정보가 수정되지 않았습니다.",
          position: "bottom-right",
        });
      })
      .finally(() => {
        onClose();
        setOldPassword("");
      });
  }

  if (member === null) {
    return <Spinner />;
  }

  let isDisableNickNameCheckButton = false;

  if (member.nickName === oldNickName) {
    isDisableNickNameCheckButton = true;
  }

  if (member.nickName.length == 0) {
    isDisableNickNameCheckButton = true;
  }

  if (isCheckedNickName) {
    isDisableNickNameCheckButton = true;
  }

  let isDisableSaveButton = false;

  if (member.password !== passwordCheck) {
    isDisableSaveButton = true;
  }

  if (member.nickName.trim().length === 0) {
    isDisableSaveButton = true;
  }

  if (!isCheckedNickName) {
    isDisableSaveButton = true;
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${member.nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 별명입니다.",
          position: "bottom-right",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 별명입니다.",
            position: "bottom-right",
          });
          setIsCheckedNickName(true);
        }
      })
      .finally();
  }
  function handleChangeProFile(e) {
    console.log(e.target.files);
    const fileView = e.target.files[0];
    setFile(fileView);
    if (fileView) {
      setFilePreview(URL.createObjectURL(fileView));
    } else {
      setFilePreview(member.awsProfile);
    }
  }

  return (
    <Box>
      <Box>회원 정보 수정</Box>
      <Box>
        <Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>프로필 사진</FormLabel>
              <Box mt={"30px"}>
                <Image boxSize={"180px"} src={filePreview} />
              </Box>
              <Input
                mt={"10px"}
                type={"file"}
                accept={"image/*"}
                onChange={handleChangeProFile}
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input readOnly value={member.email} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호</FormLabel>
            <Input
              onChange={(e) =>
                setMember({ ...member, password: e.target.value })
              }
              placeholder={"암호를 변경하려면 입력하세요"}
            />
            <FormHelperText>
              입력하지 않으면 기존 암호를 변경하지 않습니다.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호 확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {member.password === passwordCheck || (
              <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>별명</FormControl>
          <InputGroup>
            <Input
              onChange={(e) => {
                const newNickName = e.target.value.trim();
                setMember({ ...member, nickName: newNickName });
                setIsCheckedNickName(newNickName === oldNickName);
              }}
              value={member.nickName}
            />
            <InputRightElement w={"75px"} mr={1}>
              <Button
                colorScheme={"green"}
                isDisabled={isDisableNickNameCheckButton}
                size={"sm"}
                onClick={handleCheckNickName}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Box>
          <Button
            isDisabled={isDisableSaveButton}
            onClick={onOpen}
            colorScheme={"blue"}
          >
            저장
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>기존 암호 확인</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>기존 암호</FormLabel>
              <Input onChange={(e) => setOldPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme="blue" onClick={handleClickSave}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
