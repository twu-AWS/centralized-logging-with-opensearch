/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type: string;
  name: string;
  handleClick: (event: any) => void;
  isChecked: boolean;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const { id, type, name, handleClick, isChecked, disabled, ...restProps } =
    props;
  return (
    <input
      id={id}
      name={name}
      type={type}
      onChange={handleClick}
      checked={isChecked}
      disabled={disabled}
      {...restProps}
    />
  );
};

export default Checkbox;
