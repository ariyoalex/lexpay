import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

import {
  Alert,
  AlertTitle,
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormLabel,
  Input,
  Paper,
  Typography,
} from "@mui/material";

import FileUpload from "@/components/common/FileUpload";
import { useAuth } from "@/contexts/AuthContext";
import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import { ApiError } from "@/services/api";
import { updateProfileApi } from "@/services/userApi";

const validationSchema = yup.object({
  firstName: yup.string().required("Required").min(2),
  lastName: yup.string().required("Required").min(2),
  phone: yup.string().required("Required").min(10),
});

export default function Page() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.profile?.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError(null);
      setSuccess(false);
      try {
        await updateProfileApi({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          profile: { address: values.address || undefined },
        });
        setSuccess(true);
      } catch (err) {
        if (err instanceof ApiError) setServerError(err.message);
        else setServerError("An unexpected error occurred.");
      }
    },
    enableReinitialize: true,
  });

  return (
    <Box>
      <Box className="mb-6 flex items-center justify-between">
        <Box>
          <Typography variant="h1" component="h1" className="mb-0">
            Profile
          </Typography>
          <Breadcrumbs>
            <Link color="inherit" to="/dashboards/default">
              Home
            </Link>
            <Link color="inherit" to="/settings">
              Settings
            </Link>
            <Typography variant="body2">Profile</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Paper className="p-6">
        <Box className="mb-6 flex justify-center">
          <FileUpload
            onFileSelect={(file) => console.log("Photo selected:", file.name)}
            preview={user?.profile?.photo}
            label="Profile Photo"
          />
        </Box>

        <Box
          component="form"
          onSubmit={(e) => {
            formik.handleSubmit(e);
          }}
          className="mx-auto flex max-w-lg flex-col gap-4"
        >
          <FormControl variant="standard" size="small">
            <FormLabel>First Name</FormLabel>
            <Input name="firstName" value={formik.values.firstName} onChange={formik.handleChange} />
          </FormControl>
          <FormControl variant="standard" size="small">
            <FormLabel>Last Name</FormLabel>
            <Input name="lastName" value={formik.values.lastName} onChange={formik.handleChange} />
          </FormControl>
          <FormControl variant="standard" size="small">
            <FormLabel>Phone</FormLabel>
            <Input name="phone" value={formik.values.phone} onChange={formik.handleChange} />
          </FormControl>
          <FormControl variant="standard" size="small">
            <FormLabel>Address</FormLabel>
            <Input name="address" value={formik.values.address} onChange={formik.handleChange} />
          </FormControl>

          {serverError && (
            <Alert severity="error" icon={<NiCrossSquare />}>
              <AlertTitle>Error</AlertTitle>
              {serverError}
            </Alert>
          )}

          {success && <Alert severity="success">Profile updated successfully.</Alert>}

          <Button type="submit" variant="contained" className="mt-2">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
