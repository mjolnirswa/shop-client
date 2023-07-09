import styles from '@/styles/part/index.module.scss'
import { IPartImagesItemProps } from '@/types/part'

const PartImageItem = ({ src, callback, alt }: IPartImagesItemProps) => {
  const changeMainImage = () => callback(src)

  return (
    <li className={styles.part__images__list__item} onClick={changeMainImage}>
      <img src={src} alt={alt} />
    </li>
  )
}

export default PartImageItem
