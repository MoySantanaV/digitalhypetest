import React, { useEffect, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { FaEdit, FaTrash } from "react-icons/fa";
import { getData, decodeData, editData, deleteData } from "../../Services/api";
import { toast } from "react-toastify";

const Container = styled.div`
text-align: center;
`;

const Button = styled.button`
margin-top: 10px;
margin-left: 10px;
padding: 10px 20px;
font-size: 16px;
cursor: pointer;
width: 110px;
height: 40px;

@media (min-width: 407px) {
  margin-top: 12px;
}
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 200px;
`;

const CardContainer = styled.div`
    margin-top: 18px;
`;

const Card = styled.div`
  background: #363636;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const IconContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const Icon = styled.i`
  margin-left: 10px;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #000000b2;
  padding: 20px;
  border-radius: 10px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;


const Spinner = styled.div`
margin: auto;
border: 4px solid #f3f3f3;
border-top: 4px solid #025E9C;
border-radius: 50%;
width: 8px;
height: 8px;
animation: ${spin} 2s linear infinite;
`;

interface Output {
  _id: string;
  first_name: string;
  last_name: string;
  id: string;
}

const Decoder: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<Output[]>([]);
  const [modalInput, setModalInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [loadingEditStates, setLoadingEditStates] = useState<{ [key: string]: boolean }>({});
const [loadingDeleteStates, setLoadingDeleteStates] = useState<{ [key: string]: boolean }>({});
const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoadingCards(true);
      const response = await getData();
      setOutput(response);
      setIsLoadingCards(false); 
    };

    fetchData();
  }, []);

  const decodeString = async (str: string) => {
    setInput("");
    setLoadingStates({ ...loadingStates, decode: true });
    const parts = str.split(/000/);

    if (
      !parts ||
      parts.length !== 3 ||
      parts.some((part) => part.includes("000"))
    ) {
      toast.error("Invalid encoded data. Please try again.");
      setLoadingStates({ ...loadingStates, decode: false });
      return;
    }

    const decodedOutput = {
      first_name: parts[0],
      last_name: parts[1],
      id: parts[2],
    };

    const response = await decodeData(decodedOutput);

    if (response !== null) {
      setOutput(response.data);
      console.log("the return of the requirement", response.data);
    }
    setLoadingStates({ ...loadingStates, decode: false });
  };

  const handleEdit = (_id: string) => {
    setEditingId(_id);
    setIsModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (editingId) {
        setIsLoadingConfirm(true);
        setLoadingEditStates({ ...loadingEditStates, [editingId]: true });
    const parts = modalInput.split(/000/);
    if (
      !parts ||
      parts.length !== 3 ||
      parts.some((part) => part.includes("000"))
    ) {
      toast.error("Invalid encoded data. Please try again.");
      setLoadingStates({ ...loadingStates, [editingId]: false });
      setIsLoadingConfirm(false);
      return;
    }

    const decodedOutput = {
      first_name: parts[0],
      last_name: parts[1],
      id: parts[2],
    };

    const response = await editData(editingId, decodedOutput);
    if (response !== null) {
      setOutput(response.data);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setModalInput("");
    setLoadingEditStates({ ...loadingEditStates, [editingId]: false });
    setIsLoadingConfirm(false);
  }
  };

  const handleDelete = async (_id: string) => {
    setLoadingDeleteStates({ ...loadingDeleteStates, [_id]: true });
    const response = await deleteData(_id);
    if (response !== null) {
      setOutput(response.data);
    }
    setLoadingDeleteStates({ ...loadingDeleteStates, [_id]: false });
  };
  return (
    <Container>
      <Input value={input} placeholder="Enter encoded data" onChange={(e) => setInput(e.target.value)} />
      <Button onClick={() => decodeString(input)}>
      {loadingStates.decode ? <Spinner /> : "Decode"}
      </Button>
      <CardContainer>
      {isLoadingCards ? (
      <Spinner style={{marginTop:'50px'}} />
    ) : (
      output.map((data) => (
        <Card key={data._id}>
          <div>
            {data.first_name} {data.last_name} - {data.id}
          </div>
          <IconContainer>
            <Icon onClick={() => handleEdit(data._id)}>
            {loadingEditStates[data._id] ? <Spinner /> : <FaEdit />}
            </Icon>
            <Icon onClick={() => handleDelete(data._id)}>
            {loadingDeleteStates[data._id] ? <Spinner /> : <FaTrash />}
            </Icon>
          </IconContainer>
        </Card>
      ))
    )}
        </CardContainer>
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <Input
              placeholder="Enter encoded data to edit"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
            />
            <Button onClick={handleEditConfirm}>
            {isLoadingConfirm ? <Spinner /> : "Confirm"}
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
            {loadingStates.close ? <Spinner /> : "Close"}
            </Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export { Decoder };
