import * as Yup from "yup";

export const OrderSchema = Yup.object({
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  firstName: Yup.string()
    .required("Full name is required")
    .min(3, "First Name must be at least 3 characters"),

  lastName: Yup.string()
  .required("Full name is required")
  .min(3, "Last Name must be at least 3 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),

  landmark: Yup.string().nullable(),

  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),

  city: Yup.string().required("City is required"),

  state: Yup.string().required("State is required"),

  country: Yup.string()
  .required("Country is required"),

  products: Yup.array()
    .of(
      Yup.object({
        productName: Yup.string()
          .required("Product name is required")
          .min(3, "Product name too short"),

        unitPrice: Yup.number()
          .typeError("Unit price must be a number")
          .required("Unit price is required")
          .positive("Unit price must be greater than 0"),

        quantity: Yup.number()
          .required("Quantity is required")
          .min(1, "Minimum quantity is 1"),

        discount: Yup.number()
          .min(0, "Discount cannot be negative")
          .nullable(),

        taxRate: Yup.number()
          .min(0, "Tax rate cannot be negative")
          .max(100, "Tax rate cannot exceed 100")
          .nullable(),
      })
    )
    .min(1, "At least one product is required"),

  deadWeight: Yup.number()
    .typeError("Dead weight must be a number")
    .required("Dead weight is required")
    .min(0.5, "Minimum weight is 0.5 kg"),

  length: Yup.number()
    .typeError("Length must be a number")
    .required("Length is required")
    .min(0.5, "Minimum length is 0.5 cm"),

  breadth: Yup.number()
    .typeError("Breadth must be a number")
    .required("Breadth is required")
    .min(0.5, "Minimum breadth is 0.5 cm"),

  height: Yup.number()
    .typeError("Height must be a number")
    .required("Height is required")
    .min(0.5, "Minimum height is 0.5 cm"),
});

export const PickupValidation = Yup.object({
  pickup_location: Yup.string()
    .max(36, "Max 36 characters allowed")
    .required("Address nickname is required"),

    address: Yup.string()
    .matches(
      /^[0-9]+\s*,\s*[A-Za-z\s]+$/,
      "Address must be like: 110 , Home Street"
    )
    .required("Complete address is required"),
  

  landmark: Yup.string(),

  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Invalid pincode")
    .required("Pincode is required"),

  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),

  name: Yup.string().required("Name is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});

export const ReturnValidation = Yup.object({
  reason: Yup.string()
    .min(5, "Reason must be at least 5 characters")
    .required("Return reason is required"),
});

