import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm } from "react-hook-form";

export const useForm = (schema, defaultValues = {}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useReactHookForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return {
    register,
    handleSubmit,
    errors,
    reset,
    control,
    setValue,
    watch,
  };
};
