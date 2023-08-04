import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  margin-top: 20px;
`;
interface iDeveloperName {
  text: string;
}

const Footer: React.FC<iDeveloperName> = ({ text }) => {
  return <StyledFooter>{`Developed by ${text}`}</StyledFooter>;
};

export { Footer };
