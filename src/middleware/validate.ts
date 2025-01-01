import { z } from 'zod'

type ValidSchema =
  | z.ZodObject<any, any>
  | z.ZodIntersection<any, any>
  | z.ZodUnion<any>
  | z.ZodOptional<any>
  | z.ZodEffects<any, any>

export function validateBody(schema: ValidSchema) {
  return validate('body')(schema)
}

export function validateParams(schema: ValidSchema) {
  return validate('params')(schema)
}

export function validateQuery(schema: ValidSchema) {
  return validate('query')(schema)
}

export function validateHeaders(schema: ValidSchema) {
  return validate('headers')(schema)
}

function validate(type) {
  return function (schema) {
    return true
  }
}
