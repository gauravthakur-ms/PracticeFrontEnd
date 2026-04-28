import React from "react";

const Description = ({ text, style }) => {
  return <p className={`${style}`}>{text}</p>;
};

export default Description;
