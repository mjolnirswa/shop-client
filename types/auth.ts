import { FieldErrors, UseFormRegister } from 'react-hook-form'

export interface IInputs {
  name: string
  email: string
  password: string
}

export interface IAuthPageInput {
  register: UseFormRegister<IInputs>
  errors: FieldErrors<IInputs>
}

export interface ISignUpFx {
  url: string
  email: string
  password: string
  username: string
}

export interface ISignInFx {
  url: string
  password: string
  username: string
}

export interface IUser {
  email: string
  username: string
  userId: number | string
}
