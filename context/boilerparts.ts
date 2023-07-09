import { IBoilerParts } from '@/types/boilerparts'
import { IFilterCheckboxItem } from '@/types/catalog'
import { boilerManufacturers, partsManufacturers } from '@/utils/catalog'
import { createDomain } from 'effector-next'

const boilerParts = createDomain()

export const setBoilerParts = boilerParts.createEvent<IBoilerParts>()

export const setBoilerPartsCheapFirst = boilerParts.createEvent()
export const setBoilerPartsExpensiveFirst = boilerParts.createEvent()
export const setBoilerPartsByPopulatity = boilerParts.createEvent()
export const setFilteredBoilerPart = boilerParts.createEvent()

export const setBoilerManufactures =
  boilerParts.createEvent<IFilterCheckboxItem[]>()
export const updateBoilerManufactures =
  boilerParts.createEvent<IFilterCheckboxItem>()

export const setPartsManufactures =
  boilerParts.createEvent<IFilterCheckboxItem[]>()
export const updatePartsManufactures =
  boilerParts.createEvent<IFilterCheckboxItem>()

export const setBoilerManufacturesFromQuery =
  boilerParts.createEvent<string[]>()
export const setPartsManufacturesFromQuery = boilerParts.createEvent<string[]>()

const updateManufacturer = (
  manufacturers: IFilterCheckboxItem[],
  id: string,
  payload: Partial<IFilterCheckboxItem>
) =>
  manufacturers.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })

const updateManufacturerFromQuery = (
  manufacturers: IFilterCheckboxItem[],
  manufacturersFromQuery: string[]
) =>
  manufacturers.map((item) => {
    if (manufacturersFromQuery.find((title) => title === item.title)) {
      return {
        ...item,
        checked: true,
      }
    }

    return item
  })

export const $boilerParts = boilerParts
  .createStore<IBoilerParts>({} as IBoilerParts)
  .on(setBoilerParts, (_, boilerParts) => boilerParts)
  .on(setBoilerPartsCheapFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.price - b.price),
  }))
  .on(setBoilerPartsExpensiveFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.price - a.price),
  }))
  .on(setBoilerPartsByPopulatity, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.popularity - a.popularity),
  }))

export const $boilerManufactures = boilerParts
  .createStore<IFilterCheckboxItem[]>(
    boilerManufacturers as IFilterCheckboxItem[]
  )
  .on(setBoilerManufactures, (_, parts) => parts)
  .on(updateBoilerManufactures, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setBoilerManufacturesFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

export const $partsManufactures = boilerParts
  .createStore<IFilterCheckboxItem[]>(
    partsManufacturers as IFilterCheckboxItem[]
  )
  .on(setPartsManufactures, (_, parts) => parts)
  .on(updatePartsManufactures, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setPartsManufacturesFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

export const $filteredBoilerPart = boilerParts
  .createStore<IBoilerParts>({} as IBoilerParts)
  .on(setFilteredBoilerPart, (_, parts) => parts)
