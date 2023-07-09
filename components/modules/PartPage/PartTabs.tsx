import { $boilerPart } from '@/context/boilerPart'
import { $mode } from '@/context/mode'
import styles from '@/styles/part/index.module.scss'
import { useStore } from 'effector-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const PartTabs = () => {
  const mode = useStore($mode)
  const boilerPart = useStore($boilerPart)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const [showDescription, setShowDescription] = useState(true)
  const [showCompability, setShowCompabilty] = useState(false)

  const handleShowDescription = () => {
    setShowDescription(true)
    setShowCompabilty(false)
  }

  const handleShowCompability = () => {
    setShowDescription(false)
    setShowCompabilty(true)
  }

  return (
    <div className={styles.part__tabs}>
      <div className={`${styles.part__tabs__controls} ${darkModeClass}`}>
        <button
          className={showDescription ? styles.active : ''}
          onClick={handleShowDescription}
        >
          Описание
        </button>
        <button
          className={showCompability ? styles.active : ''}
          onClick={handleShowCompability}
        >
          Совместимость
        </button>
      </div>
      {showDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.part__tabs__content}
        >
          <h3
            className={`${styles.part__tabs__content__title} ${darkModeClass}`}
          >
            {boilerPart.name}
          </h3>
          <p className={`${styles.part__tabs__content__text} ${darkModeClass}`}>
            {boilerPart.description}
          </p>
        </motion.div>
      )}
      {showCompability && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.part__tabs__content}
        >
          <p className={`${styles.part__tabs__content__text} ${darkModeClass}`}>
            {boilerPart.compatibility}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default PartTabs
