// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateFormData = async (data: {
  [key: string]: any;
}): Promise<[any, boolean]> => {
  let isValid = true;
  let validatedData = data;
  return new Promise((resolve) => {
    for (const [field, fieldData] of Object.entries(data)) {
      if (fieldData.validator === "text") {
        let error = null;
        if (fieldData.isRequired && !fieldData.value) {
          error = "This field is required.";
          isValid = false;
        }
        if (fieldData.value) {
          if (
            fieldData.minLength &&
            fieldData.value.length < fieldData.minLength
          ) {
            error = `This field must be at least ${fieldData.minLength} characters.`;
            isValid = false;
          }
          if (
            fieldData.maxLength &&
            fieldData.value.length > fieldData.maxLength
          ) {
            error = `This field must be at most ${fieldData.maxLength} characters.`;
            isValid = false;
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error: error,
          },
        };
      }

      if (fieldData.validator === "object") {
        let error = null;
        if (
          fieldData.isRequired &&
          (!fieldData.value ||
            (!!fieldData.value &&
              Object.keys(fieldData.value).length === 0 &&
              fieldData.value.constructor === Object))
        ) {
          error = "This field is required.";
          isValid = false;
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error: error,
          },
        };
      }

      if (fieldData.validator === "array") {
        let error = null;
        if (
          !!fieldData.value &&
          fieldData.value.length === 0 &&
          fieldData.isRequired
        ) {
          error = "This field is required.";
          isValid = false;
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error: error,
          },
        };
      }

      if (fieldData.validator === "email") {
        let error = null;
        if (fieldData.isRequired && !fieldData.value) {
          error = "This field is required.";
          isValid = false;
        }
        if (!!fieldData.value) {
          const lastAtPos = fieldData.value.lastIndexOf("@");
          const lastDotPos = fieldData.value.lastIndexOf(".");
          if (
            !(
              lastAtPos < lastDotPos &&
              lastAtPos > 0 &&
              fieldData.value.indexOf("@@") === -1 &&
              lastDotPos > 2 &&
              fieldData.value.length - lastDotPos > 2
            )
          ) {
            isValid = false;
            error = "Email is not valid";
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error: error,
          },
        };
      }

      if (fieldData.validator === "number") {
        let error = null;
        if (fieldData.isRequired && fieldData.value === "") {
          error = "This field is required.";
          isValid = false;
        }
        if (fieldData.value < 0) {
          error = "This field must be a positive number.";
          isValid = false;
        }
        if (fieldData.value) {
          if (!!isNaN(fieldData.value)) {
            isValid = false;
            error = "This field must be a number";
          }
        }
        validatedData = {
          ...validatedData,
          [field]: {
            ...fieldData,
            error: error,
          },
        };
      }
    }
    resolve([validatedData, isValid]);
  });
};
