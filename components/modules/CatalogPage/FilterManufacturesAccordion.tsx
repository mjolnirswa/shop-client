import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import styles from '@/styles/catalog/index.module.scss'
import { IFilterManufacturerAccordionProps } from '@/types/catalog'
import Accordion from '@/components/elements/Accordion/Accordion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import FilterCheckboxItem from './FilterCheckboxItem'

const FilterManufacturesAccordion = ({
  manufacturersList,
  title,
  setManufacturer,
  updateManufacturer,
}: IFilterManufacturerAccordionProps) => {
  const mode = useStore($mode)
  const isMobile = useMediaQuery(820)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const chooseAllManufacturers = () =>
    setManufacturer(
      manufacturersList.map((item) => ({ ...item, checked: true }))
    )

  return (
    <Accordion
      title={title}
      titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
      arrowOpenClass={styles.open}
      isMobileForFilters={isMobile}
      hideArrowClass={isMobile ? styles.hide_arrow : ''}
    >
      <div className={styles.filters__manufacturer__inner}>
        <button
          className={styles.filters__manufacturer__select_all}
          onClick={chooseAllManufacturers}
        >
          Выбрать все
        </button>
        <ul className={styles.filters__manufacturer__list}>
          {manufacturersList.map((item) => (
            <FilterCheckboxItem
              title={item.title}
              id={item.id}
              key={item.id}
              checked={item.checked}
              event={updateManufacturer}
            />
          ))}
        </ul>
        <div style={{ height: 24 }} />
      </div>
    </Accordion>
  )
}

export default FilterManufacturesAccordion
