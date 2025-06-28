"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";

import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { Field, Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";

import { Button } from "@mui/material";
import { signInWithPassword } from "src/auth/context/jwt";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(4, { message: "Password must be at least 4 characters!" }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState("");

  const password = useBoolean();

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : typeof error.message === "string"
            ? error.message
            : "An unexpected error occurred. Please try again later.",
      );
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Entre na sua conta</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Stack spacing={1.5}>
        <Field.Text
          name="password"
          label="Password"
          placeholder="4+ characters"
          type={password.value ? "text" : "password"}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </Button>
    </Stack>
  );

  return (
    <>
      {renderHead}
      <Alert
        severity="info"
        sx={{ mb: .5}}
        onClick={() => {
          methods.setValue("email", "user@user.com");
          methods.setValue("password", "user");
        }}
      >
        Use <strong>user@user.com</strong>
        {" com a senha "}
        <strong>user</strong>
      </Alert>
      <Alert
        severity="info"
        sx={{ mb: 3 }}
        onClick={() => {
          methods.setValue("email", "admin@admin.com");
          methods.setValue("password", "admin");
        }}
      >
        Use <strong>admin@admin.com</strong>
        {" com a senha "}
        <strong>admin</strong>
      </Alert>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
