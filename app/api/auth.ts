import { ISignInFx, ISignUpFx } from '../../types/auth'
import { createEffect } from 'effector'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { HTTPStatus } from '@/constants'

export const singUpfx = createEffect(
  async ({ url, username, password, email }: ISignUpFx) => {
    const { data } = await api.post(url, { username, password, email })

    if (data.warningMessage) {
      toast.warning(data.warningMessage)
      return
    }

    return data
  }
)

export const signInfx = createEffect(
  async ({ url, username, password }: ISignInFx) => {
    const { data } = await api.post(url, { username, password })

    if (data.warningMessage) {
      toast.warning(data.warningMessage)
      return
    }

    return data
  }
)

export const checkUserAuthFx = createEffect(async (url: string) => {
  try {
    const { data } = await api.get(url)

    return data
  } catch (e) {
    const axiosError = e as AxiosError

    if (axiosError.response) {
      if (axiosError.response.status === HTTPStatus.FORBIDDEN) {
        return false
      }
    }

    toast.error((e as Error).message)
  }
})

export const logoutFx = createEffect(async (url: string) => {
  try {
    await api.get(url)
  } catch (e) {
    toast.error((e as Error).message)
  }
})
