import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getData, decodeData, editData, deleteData } from "../../Services/api";
import { toast } from "react-toastify";

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 200px;
`;

const Card = styled.div`
  background: #363636;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const Icon = styled.i`
  margin-left: 10px;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData();
      setOutput(response);
    };

    fetchData();
  }, []);

  const decodeString = async (str: string) => {
    const parts = str.split(/000/);

    if (
      !parts ||
      parts.length !== 3 ||
      parts.some((part) => part.includes("000"))
    ) {
      toast.error("Invalid encoded data. Please try again.");
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

    setInput("");
  };

  const handleEdit = (_id: string) => {
    setEditingId(_id);
    setIsModalOpen(true);
  };

  const handleEditConfirm = async () => {
    const parts = modalInput.split(/000/);
    if (
      !parts ||
      parts.length !== 3 ||
      parts.some((part) => part.includes("000"))
    ) {
      toast.error("Invalid encoded data. Please try again.");
      return;
    }

    const decodedOutput = {
      first_name: parts[0],
      last_name: parts[1],
      id: parts[2],
    };

    if (editingId) {
      const response = await editData(editingId, decodedOutput);
      if (response !== null) {
        setOutput(response.data);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setModalInput("");
    }
  };

  const handleDelete = async (_id: string) => {
    const response = await deleteData(_id);
    if (response !== null) {
      setOutput(response.data);
    }
  };
  return (
    <Container>
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button onClick={() => decodeString(input)}>Decode</Button>
      {output &&
        output.map((data) => (
          <Card key={data._id}>
            <div>
              {data.first_name} {data.last_name} - {data.id}
            </div>
            <div>
              <Icon onClick={() => handleEdit(data._id)}>
                <FaEdit />
              </Icon>{" "}
              <Icon onClick={() => handleDelete(data._id)}>
                <FaTrash />
              </Icon>{" "}
            </div>
          </Card>
        ))}
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <Input
              placeholder="Enter encoded data"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
            />
            <Button onClick={handleEditConfirm}>Confirm</Button>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export { Decoder };
