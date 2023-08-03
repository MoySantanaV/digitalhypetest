import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getData, decodeData, editData, deleteData } from '../../Services/api';

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

interface Output {
    _id: string;
    first_name: string;
    last_name: string;
    id: string;
  }
  
  const Decoder: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<Output[]>([]);


    useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        const response = await getData();
        setOutput(response.data);
      };
  
    const decodeString = async (str: string) => {
      const parts = str.split(/000/);

      if (!parts || parts.length !== 3 || parts.some(part => part.includes('000'))) {
        alert("Invalid encoded data. Please try again.");
        return;
      }
  
      const decodedOutput = {
        first_name: parts[0],
        last_name: parts[1],
        id: parts[2]
      };
  
      try {

        const response = await decodeData(decodedOutput);
  

        setOutput(response.data);

        console.log('the return of the requirement', response.data)
      } catch (err) {
        console.error(err);
      }

      setInput('');
    }

    const handleEdit = async (_id: string) => {
        const encodedStr = prompt('Enter encoded data');
      
        const parts = encodedStr?.split(/000/);
        if (!parts || parts.length !== 3 || parts.some(part => part.includes('000'))) {
          alert("Invalid encoded data. Please try again.");
          return;
        }
      
        const decodedOutput = {
          first_name: parts[0],
          last_name: parts[1],
          id: parts[2]
        };
      
        const response = await editData(_id, decodedOutput);
        setOutput(response.data);
      }
      

      const handleDelete = async (_id: string) => {
        const response = await  deleteData(_id);
        setOutput(response.data);
      }
  return (
    <Container>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <Button onClick={() => decodeString(input)}>Decode</Button>
      {output && output.map( data => (
  <Card key={data._id}>
  <div>
    {data.first_name} {data.last_name} - {data.id}
  </div>
  <div>
    <Icon onClick={() => handleEdit(data._id)}><FaEdit /></Icon>  {/* Ícono de edición */}
    <Icon onClick={() => handleDelete(data._id)}><FaTrash /></Icon>  {/* Ícono de eliminación */}
  </div>
</Card>
      ))}
    </Container>
  );
}

export {Decoder};
