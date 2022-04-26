import Ajv from "ajv";
import addFormats from "ajv-formats"
import jsonSchemaFilter from "uber-json-schema-filter";

export type ValidateSuccess<T> = {
  isValid: true;
  values: T;
  message: string;
}

export type ValidateFailture = {
  isValid: false;
  values: null;
  errors: object[];
  message: string;
}

type ValidateResult<T> = ValidateSuccess<T> | ValidateFailture;

const JsonSchema = new Ajv({
  allErrors: true
});
addFormats(JsonSchema)

export const filter = jsonSchemaFilter;

export const validate = <T>(schema, data: Partial<T>): ValidateResult<T> => {
  const validate = JsonSchema.compile(schema);
  const isValid = validate(data);
  if (true === isValid) {
    return {
      isValid: true,
      // フィルター済みデータ
      values: jsonSchemaFilter(schema, data),
      message: '',
    } as ValidateSuccess<T>;
  } else {
    return {
      isValid: false,
      values: null,
      errors: validate.errors,
      message: JsonSchema.errorsText(validate.errors, { separator: "\n" }),
    } as ValidateFailture;
  }
};
