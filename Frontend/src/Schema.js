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

  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),

  landmark: Yup.string().nullable(),

  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),

  city: Yup.string().required("City is required"),

  state: Yup.string().required("State is required"),

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
