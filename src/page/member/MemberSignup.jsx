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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  function handleMemberSaveClick() {
    setIsLoading(true);
    axios
      .postForm("/api/member/signup", {
        email,
        password,
        nickName,
        file,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다.",
          position: "bottom-right",
          duration: 2000,
        });
        navigate("/"); //로그인 화면으로 이동 나중에 추가
      })
      .catch((err) => {
        const code = err.response.status;
        if (code === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "bottom-right",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "bottom-right",
          });
        }
      })
      .finally(() => setIsLoading(false));
  }

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다.",
          position: "bottom-right",
          duration: 1000,
        });
      }) // 이미 있는 이메일 (사용 못함)
      .catch((err) => {
        if (err.response.status === 404) {
          // 사용할 수 있는 이메일
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다.",
            position: "bottom-right",
            duration: 1000,
          });
          setIsCheckedEmail(true);
        }
      })
      .finally();
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "중복된 닉네임입니다.",
          position: "bottom-right",
          duration: 1000,
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다.",
            position: "bottom-right",
            duration: 1000,
          });
          setIsCheckedNickName(true);
        }
      })
      .finally();
  }

  let isDisabled = false;
  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      nickName.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  if (!isCheckedEmail) {
    isDisabled = true;
  }

  if (!isCheckedNickName) {
    isDisabled = true;
  }

  if (!isValidEmail) {
    isDisabled = true;
  }

  const isCheckPassword = password === passwordCheck;

  function handleChangeProFile(e) {
    const fileView = e.target.files[0];
    setFile(fileView);
    if (fileView) {
      setFilePreview(URL.createObjectURL(fileView));
    } else {
      setFilePreview(null);
    }
  }

  return (
    <Box mt={"30px"}>
      <Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>프로필 사진</FormLabel>
            <Box borderRadius="full" mt={"30px"}>
              {filePreview && <Image boxSize={"180px"} src={filePreview} />}
              {filePreview || (
                <Image
                  boxSize={"180px"}
                  src={
                    "data:image/jpeg;base64,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"
                  }
                />
              )}
            </Box>
            <Input
              mt={"10px"}
              type={"file"}
              accept={"image/*"}
              onChange={handleChangeProFile}
            />
          </FormControl>
        </Box>

        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                type={"email"}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsCheckedEmail(false);
                  setIsValidEmail(!e.target.validity.typeMismatch);
                }}
              />
              <InputRightElement w={"100px"} mr={1}>
                <Button
                  isDisabled={!isValidEmail || email.trim().length === 0}
                  onClick={handleCheckEmail}
                  size={"sm"}
                  colorScheme={"green"}
                >
                  중복 확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {isCheckedEmail || (
              <FormHelperText color={"blue"}>
                이메일 중복확인 해주세요.
              </FormHelperText>
            )}
            {isValidEmail || (
              <FormHelperText>올바른 이메일 형식이 아닙니다. </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>패스워드 확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {isCheckPassword || (
              <FormHelperText color={"blue"}>
                암호가 일치하지 않습니다.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <InputGroup>
              <Input
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value.trim());
                  setIsCheckedNickName(false);
                }}
              />
              <InputRightElement w={"100px"} mr={1}>
                <Button
                  isDisabled={nickName.trim().length === 0}
                  onClick={handleCheckNickName}
                  size={"sm"}
                  colorScheme={"green"}
                >
                  중복 확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {isCheckedNickName || (
              <FormHelperText color={"blue"}>
                닉네임 중복확인 해주세요.
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box mt={"30px"}>
          <Button
            isDisabled={isDisabled}
            isLoading={isLoading}
            onClick={handleMemberSaveClick}
            colorScheme={"blue"}
          >
            가입
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
