import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import styles from '@/styles/catalog/index.module.scss'
import { ICatalogFilterMobileProps } from '@/types/catalog'
import spinnerStyles from '@/styles/spinner/spinner.module.scss'
import FiltersPopupTop from './FiltersPopupTop'
import FiltersPopup from './FiltersPopup'
import {
  $boilerManufactures,
  $partsManufactures,
  setBoilerManufactures,
  setPartsManufactures,
  updateBoilerManufactures,
  updatePartsManufactures,
} from '@/context/boilerparts'
import { useState } from 'react'
import PriceRange from './PriceRange'
import Accordion from '@/components/elements/Accordion/Accordion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const CatalogFiltersMobile = ({
  spinner,
  resetFilterBtnDisabled,
  resetFilters,
  closePopup,
  applyFilters,
  filtersMobileOpen,
  setIsPriceRangeChanged,
  priceRange,
  setPriceRange,
}: ICatalogFilterMobileProps) => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const boilerManufactures = useStore($boilerManufactures)
  const partsManufactures = useStore($partsManufactures)
  const [openBoilers, setOpenBoilers] = useState(false)
  const [openParts, setOpenParts] = useState(false)

  const handleOpenBoilers = () => setOpenBoilers(true)
  const handleCloseBoilers = () => setOpenBoilers(false)
  const handleOpenParts = () => setOpenParts(true)
  const handleCloseParts = () => setOpenParts(false)

  const isAnyBoilerManufacturerChecked = boilerManufactures.some(
    (item) => item.checked
  )
  const isAnyPartManufacturerChecked = partsManufactures.some(
    (item) => item.checked
  )

  const isMobile = useMediaQuery(820)

  const resetAllBoilerManufacturers = () =>
    setBoilerManufactures(
      boilerManufactures.map((item) => ({ ...item, checked: false }))
    )

  const resetAllPartManufacturers = () =>
    setPartsManufactures(
      partsManufactures.map((item) => ({ ...item, checked: false }))
    )

  const applyFiltersAndClosePopup = async () => {
    applyFilters()
    closePopup()
  }

  return (
    <div
      className={`${styles.catalog__bottom__filters} ${darkModeClass} ${
        filtersMobileOpen ? styles.open : ''
      }`}
    >
      <div className={styles.catalog__bottom__filters__inner}>
        <FiltersPopupTop
          resetBtnText="Сбросить все"
          title="Фильтры"
          resetFilters={resetFilters}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          closePopup={closePopup}
        />
        <div className={styles.filters__boiler_manufacturers}>
          <button
            className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
            onClick={handleOpenBoilers}
          >
            Производитель котлов
          </button>
          <FiltersPopup
            title="Производитель котлов"
            resetFilterBtnDisabled={!isAnyBoilerManufacturerChecked}
            updateManufacturer={updateBoilerManufactures}
            setManufacturer={setBoilerManufactures}
            applyFilters={applyFiltersAndClosePopup}
            manufacturersList={boilerManufactures}
            resetAllManufacturers={resetAllBoilerManufacturers}
            handleClosePopup={handleCloseBoilers}
            openPopup={openBoilers}
          />
        </div>
        <div className={styles.filters__boiler_manufacturers}>
          <button
            className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
            onClick={handleOpenParts}
          >
            Производитель запчастей
          </button>
          <FiltersPopup
            title="Производитель запчастей"
            resetFilterBtnDisabled={!isAnyPartManufacturerChecked}
            updateManufacturer={updatePartsManufactures}
            setManufacturer={setPartsManufactures}
            applyFilters={applyFiltersAndClosePopup}
            manufacturersList={partsManufactures}
            resetAllManufacturers={resetAllPartManufacturers}
            handleClosePopup={handleCloseParts}
            openPopup={openParts}
          />
        </div>
        <div className={styles.filters__price}>
          <Accordion
            title="Цена"
            titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
            hideArrowClass={styles.hide_arrow}
            isMobileForFilters={isMobile}
            arrowOpenClass=""
          >
            <div className={styles.filters__manufacturer__inner}>
              <PriceRange
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                setIsPriceRangeChanged={setIsPriceRangeChanged}
              />
              <div style={{ height: 24 }} />
            </div>
          </Accordion>
        </div>
      </div>
      <div className={styles.filters__actions}>
        <button
          className={styles.filters__actions__show}
          onClick={applyFiltersAndClosePopup}
          disabled={resetFilterBtnDisabled}
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
      </div>
    </div>
  )
}

export default CatalogFiltersMobile
