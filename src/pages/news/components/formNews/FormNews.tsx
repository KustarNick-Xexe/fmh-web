import { format } from "date-fns";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { categories } from "src/common/categories";
import { selectUserInfo } from "src/features/auth/authSlice";
import { INews } from "src/model/INews";
import { getRefDate, getRefChecked, getRefValue } from "src/utils/GetRef";
import { ModalContext } from "src/components/modal/Modal";
import { ErrorComponents } from "src/components/errorComponent/ErrorComponents";
import { useValidation } from "src/hooks/useValidation/useValidation";
import styles from "./FormNews.module.less";

const FormNews = ({
  news,
  title,
  submit,
}: {
  news: INews | undefined;
  title: string;
  submit: (formData: INews) => void;
}) => {
  const changeVisible = useContext(ModalContext);
  const categoryRef = React.createRef<HTMLSelectElement>();
  const dateRef = React.createRef<HTMLInputElement>();
  const timeRef = React.createRef<HTMLInputElement>();
  const titleRef = React.createRef<HTMLInputElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();
  const checkActiveRef = React.createRef<HTMLInputElement>();
  const userInfo = useSelector(selectUserInfo);
  const [checked, setChecked] = useState(false);

  const [validate, messages] = useValidation();

  const handleChange = () => {
    setChecked(!checked);
  };

  const submitValue = async () => {
    const formData = {
      createDate: news?.createDate || Date.now(),
      description: getRefValue(descriptionRef, ""),
      newsCategoryId: getRefValue(categoryRef, 0),
      publishEnabled: getRefChecked(checkActiveRef, false),
      title: getRefValue(titleRef, ""),
      creatorId: userInfo.id,
      creatorName: `${userInfo.firstName} ${userInfo.lastName} ${userInfo.middleName}`,
      publishDate: getRefDate(dateRef, timeRef),
      id: news?.id || 0,
    };
    const dataIsValid = await validate(formData);
    if (dataIsValid) {
      submit(formData);
      changeVisible?.();
    }
  };
  return (
    <div className={styles.form_news__container}>
      <header className={styles.header_news}>
        <div className={styles.header_title}>{title}</div>
      </header>
      <div className={styles.news_form}>
        <div className={styles.news_row}>
          <select className={styles.news_category} ref={categoryRef}>
            {[{ title: "Выберите категорию", img: "" }, ...categories].map(
              (category, index) => (
                <option
                  hidden={!index}
                  key={category.title}
                  value={index > 0 ? index : ""}
                >
                  {category.title}
                </option>
              )
            )}
          </select>
          <div className={styles.news_date}>
            <input
              type="date"
              placeholder="Дата"
              ref={dateRef}
              min={format(new Date(), "yyyy-MM-dd")}
              defaultValue={
                news
                  ? format(news.publishDate, "yyyy-MM-dd")
                  : format(Date.now(), "yyyy-MM-dd")
              }
            />
          </div>
          <div className={styles.news_time}>
            <input
              type="time"
              ref={timeRef}
              defaultValue={
                news
                  ? format(news.publishDate, "HH:mm")
                  : format(Date.now(), "HH:mm")
              }
            />
          </div>
        </div>
        <input
          className={styles.news_category}
          type="text"
          placeholder="Заголовок"
          ref={titleRef}
          defaultValue={news?.title || ""}
          minLength={2}
        />
        <textarea
          className={styles.news_description}
          placeholder="Описание"
          ref={descriptionRef}
          defaultValue={news ? news.description : ""}
          minLength={20}
        />
        <div className={styles.news_activity}>
          <input
            type="checkbox"
            className={styles.news_cb}
            ref={checkActiveRef}
            checked={checked}
            onChange={handleChange}
          />
          <span>{checked ? "Активна" : "Не активна"}</span>
        </div>

        <ErrorComponents
          errorMessages={messages}
          callbackReset={() => console.log("reset")}
        />

        <div className={styles.news_controls}>
          <button
            type="button"
            className={`${styles.news_add__button} ${styles.news_add__button_save}`}
            onClick={() => submitValue()}
          >
            СОХРАНИТЬ
          </button>
          <button
            type="button"
            className={styles.news_add__button}
            onClick={() => changeVisible?.()}
          >
            ОТМЕНИТЬ
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormNews;
