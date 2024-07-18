import { Input } from "@headlessui/react";

export default function InputLabel({
  value, 
  setValue, 
  label, 
  name, 
  placement = 'outside', 
  placeholder, 
  errorMessage, 
  isInvalid,
  forwardRef
}){
  const typeValue = label === 'Email' ? 'email' : label === 'Password' ? 'password' : 'text';

  const isInvalidFinal = isInvalid && (value === '' || value.length < 3); 
  return(
    <Input
      value={value}
      isRequired
      key={label}
      type={typeValue}
      label={label}
      name={name}
      isInvalid={isInvalidFinal}
      color={isInvalidFinal ? "danger" : !isInvalidFinal && value.length > 3 ? 'success' : 'default'}
      onValueChange={setValue}
      errorMessage={errorMessage}
      labelPlacement={placement}
      placeholder={placeholder}
      ref={forwardRef}
    />
  );
}