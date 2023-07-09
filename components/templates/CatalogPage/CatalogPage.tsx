import { getBoilerPartsFx } from '@/app/api/boilerparts'
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect'
import ManufacturesBlock from '@/components/modules/CatalogPage/ManufacturesBlock'
import {
  $boilerManufactures,
  $boilerParts,
  $filteredBoilerPart,
  $partsManufactures,
  setBoilerManufactures,
  setBoilerParts,
  setPartsManufactures,
  updateBoilerManufactures,
  updatePartsManufactures,
} from '@/context/boilerparts'
import { $mode } from '@/context/mode'
import styles from '@/styles/catalog/index.module.scss'
import { useStore } from 'effector-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem'
import ReactPaginate from 'react-paginate'
import { IQueryParams } from '@/types/catalog'
import { useRouter } from 'next/router'
import { IBoilerParts } from '@/types/boilerparts'
import CatalogFilters from '@/components/modules/CatalogPage/CatalogFilters'
import { usePopup } from '@/hooks/usePopup'
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg'

const CatalogPage = ({ query }: { query: IQueryParams }) => {
  const mode = useStore($mode)
  const boilerparts = useStore($boilerParts)
  const boilerManufactures = useStore($boilerManufactures)
  const partsManufactures = useStore($partsManufactures)
  const filteredBoilerParts = useStore($filteredBoilerPart)
  const [spinner, setSpinner] = useState(false)
  const [priceRange, setPriceRange] = useState([1000, 9000])
  const [isFilterInQuery, setIsFilterInQuery] = useState(false)
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false)
  const pagesCount = Math.ceil(boilerparts.count / 20)
  const isValidOffset =
    query.offset && !isNaN(+query.offset) && +query.offset > 0
  const [currentPage, setCurrentPage] = useState(
    isValidOffset ? +query.offset - 1 : 0
  )
  const router = useRouter()
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const skeletonDarkModeClass =
    mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''

  const isAnyBoilerManufacturerChecked = boilerManufactures.some(
    (item) => item.checked
  )
  const isAnyPartManufacturerChecked = partsManufactures.some(
    (item) => item.checked
  )

  const resetFilterBtnDisabled = !(
    isPriceRangeChanged ||
    isAnyBoilerManufacturerChecked ||
    isAnyPartManufacturerChecked
  )

  const { toggleOpen, open, closePopup } = usePopup()

  useEffect(() => {
    loadBoilerParts()
  }, [filteredBoilerParts, isFilterInQuery])

  const loadBoilerParts = async () => {
    try {
      setSpinner(true)
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      if (!isValidOffset) {
        router.replace({
          query: {
            offset: 1,
          },
        })

        resetPagination(data)
        return
      }

      if (isValidOffset) {
        if (+query.offset > Math.ceil(data.count / 20)) {
          router.push(
            {
              query: {
                ...query,
                offset: 1,
              },
            },
            undefined,
            { shallow: true }
          )

          setCurrentPage(0)
          setBoilerParts(isFilterInQuery ? filteredBoilerParts : data)
          return
        }

        const offset = +query.offset - 1
        const result = await getBoilerPartsFx(
          `/boiler-parts?limit=20&offset=${offset}`
        )

        setCurrentPage(offset)
        setBoilerParts(isFilterInQuery ? filteredBoilerParts : result)
        return
      }

      setCurrentPage(0)
      setBoilerParts(isFilterInQuery ? filteredBoilerParts : data)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  const resetPagination = (data: IBoilerParts) => {
    setCurrentPage(0)
    setBoilerParts(data)
  }

  const handlePageChange = async ({ selected }: { selected: number }) => {
    try {
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      if (selected > pagesCount) {
        resetPagination(data)
        return
      }

      if (isValidOffset && +query.offset > Math.ceil(data.count / 2)) {
        resetPagination(isFilterInQuery ? filteredBoilerParts : data)
        return
      }

      const result = await getBoilerPartsFx(
        `/boiler-parts?limit=20&offset=${selected}${
          isFilterInQuery && router.query.boiler
            ? `&boiler=${router.query.boiler}`
            : ''
        }${
          isFilterInQuery && router.query.parts
            ? `&parts=${router.query.boiler}`
            : ''
        }${
          isFilterInQuery && router.query.priceFrom && router.query.priceTo
            ? `&priceFrom=${router.query.priceFrom}&priceTo=${router.query.priceTo}`
            : ''
        }`
      )

      router.push(
        {
          query: {
            ...router.query,
            offset: selected + 1,
          },
        },
        undefined,
        { shallow: true }
      )

      setCurrentPage(selected)
      setBoilerParts(result)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetFilters = async () => {
    try {
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')
      const params = router.query

      delete params.boiler
      delete params.parts
      delete params.priceFrom
      delete params.priceTo
      params.first = 'cheap'

      router.push({ query: { ...params } }, undefined, { shallow: true })

      setBoilerManufactures(
        boilerManufactures.map((item) => ({ ...item, checked: false }))
      )
      setPartsManufactures(
        partsManufactures.map((item) => ({ ...item, checked: false }))
      )

      setBoilerParts(data)
      setPriceRange([1000, 9000])
      setIsPriceRangeChanged(false)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
        </h2>

        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            {isAnyBoilerManufacturerChecked && (
              <ManufacturesBlock
                title="Производитель котлов:"
                event={updateBoilerManufactures}
                manufacturersList={boilerManufactures}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isAnyPartManufacturerChecked && (
              <ManufacturesBlock
                title="Производитель запчастей:"
                event={updatePartsManufactures}
                manufacturersList={partsManufactures}
              />
            )}
          </AnimatePresence>

          <div className={styles.catalog__top__inner}>
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}
              onClick={resetFilters}
            >
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}
            >
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect setSpinner={setSpinner} />
          </div>
        </div>

        <div className={`${styles.catalog__bottom}`}>
          <div className={styles.catalog__bottom__inner}>
            <CatalogFilters
              priceRange={priceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              setPriceRange={setPriceRange}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
              isPriceRangeChanged={isPriceRangeChanged}
              currentPage={currentPage}
              setIsFilterInQuery={setIsFilterInQuery}
              closePopup={closePopup}
              filtersMobileOpen={open}
            />
            {spinner ? (
              <ul className={skeletonStyles.skeleton}>
                {Array.from(new Array(20)).map((_, i) => (
                  <li
                    className={`${skeletonStyles.skeleton__item} ${skeletonDarkModeClass}`}
                    key={i}
                  >
                    <div className={skeletonStyles.skeleton__item__light} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.catalog__list}>
                {boilerparts.rows?.length ? (
                  boilerparts.rows.map((item) => (
                    <CatalogItem item={item} key={item.id} />
                  ))
                ) : (
                  <span>Список товаров пуст...</span>
                )}
              </ul>
            )}
          </div>
          <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={styles.catalog__bottom__list__break__link}
            nextClassName={styles.catalog__bottom__list__next}
            breakLabel="..."
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  )
}

export default CatalogPage
