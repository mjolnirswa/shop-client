import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import styles from '@/styles/catalog/index.module.scss'
import {
  $boilerManufactures,
  $partsManufactures,
  setBoilerManufactures,
  setPartsManufactures,
  updateBoilerManufactures,
  updatePartsManufactures,
} from '@/context/boilerparts'
import FilterManufacturesAccordion from './FilterManufacturesAccordion'
import Accordion from '@/components/elements/Accordion/Accordion'
import PriceRange from './PriceRange'
import spinnerStyles from '@/styles/spinner/spinner.module.scss'
import { ICatalogFilterDesktopProps } from '@/types/catalog'

const CatalogFiltersDekstop = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  spinner,
  resetFilters,
  applyFilters,
}: ICatalogFilterDesktopProps) => {
  const mode = useStore($mode)
  const boilerManufactures = useStore($boilerManufactures)
  const partsManufactures = useStore($partsManufactures)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  return (
    <div className={`${styles.catalog__bottom__filters} ${darkModeClass}`}>
      <h3
        className={`${styles.catalog__bottom__filters__title} ${darkModeClass}`}
      >
        Фильтры
      </h3>

      <div className={styles.filters__boiler_manufactures}>
        <FilterManufacturesAccordion
          manufacturersList={boilerManufactures}
          title="Производитель котлов"
          updateManufacturer={updateBoilerManufactures}
          setManufacturer={setBoilerManufactures}
        />
      </div>

      <div className={styles.filters__price}>
        <Accordion
          title="Цена"
          titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
          arrowOpenClass={styles.open}
        >
          <div className={styles.filters__manufacturer__inner}>
            <PriceRange
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
            />
          </div>
        </Accordion>
      </div>

      <div className={styles.filters__boiler_manufacturers}>
        <FilterManufacturesAccordion
          manufacturersList={partsManufactures}
          title="Производитель запчастей"
          updateManufacturer={updatePartsManufactures}
          setManufacturer={setPartsManufactures}
        />
      </div>

      <div className={styles.filters__actions}>
        <button
          className={styles.filters__actions__show}
          disabled={spinner || resetFilterBtnDisabled}
          onClick={applyFilters}
        >
          {spinner ? (
            <span
              className={spinnerStyles.spinner}
              style={{ top: 6, left: '47%' }}
            />
          ) : (
            'Показать'
          )}
        </button>
        <button
          className={styles.filters__actions__reset}
          disabled={resetFilterBtnDisabled}
          onClick={resetFilters}
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}

export default CatalogFiltersDekstop
