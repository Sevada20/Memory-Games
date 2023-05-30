import React, { useReducer, useState } from "react";
import styles from "./MemoryGame.module.css";
import htmlImg from "../../img/html.png";
import cssImg from "../../img/css.png";
import jsImg from "../../img/js.png";
import reactImg from "../../img/react.png";
import reduxImg from "../../img/redux.png";
import formikImg from "../../img/formik.png";

const initialState = {
  cardsArr: [
    { id: 1, img: htmlImg, showImg: false },
    { id: 2, img: cssImg, showImg: false },
    { id: 3, img: jsImg, showImg: false },
    { id: 4, img: reactImg, showImg: false },
    { id: 5, img: reduxImg, showImg: false },
    { id: 6, img: formikImg, showImg: false },
    { id: 7, img: htmlImg, showImg: false },
    { id: 8, img: cssImg, showImg: false },
    { id: 9, img: jsImg, showImg: false },
    { id: 10, img: reactImg, showImg: false },
    { id: 11, img: reduxImg, showImg: false },
    { id: 12, img: formikImg, showImg: false },
  ],
  photosToCompare: [],
};

const MemoryGame = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gameEnd, setGameEnd] = useState(false);

  function reducer(state, action) {
    switch (action.type) {
      case "shuffleRandom":
        const shuffledCards = state.cardsArr.sort(() => Math.random() - 0.5);
        return { ...state, cardsArr: shuffledCards };

      case "hideAllImages":
        const newCardsHiddenImages = state.cardsArr.map((card) => {
          return { ...card, showImg: false };
        });
        return {
          ...state,
          cardsArr: newCardsHiddenImages,
        };
      case "doubleChangeShowImgToFalse":
        const updateArr = state.cardsArr.map((card) => {
          if (
            card.id === action.payload.id1 ||
            card.id === action.payload.id2
          ) {
            return { ...card, showImg: false };
          }
          return card;
        });
        return {
          ...state,
          cardsArr: updateArr,
        };

      case "changeShowImg":
        const newCardsArr = state.cardsArr.map((card) => {
          if (card.id === action.payload) {
            return { ...card, showImg: true };
          }
          return card;
        });
        return { ...state, cardsArr: newCardsArr };
      case "addPhotoToPhotoCompare":
        return {
          ...state,
          photosToCompare: [...state.photosToCompare, action.payload],
        };
      case "deletePhotoToPhotoCompare":
        return {
          ...state,
          photosToCompare: [],
        };
      case "comparePhoto":
        if (state.photosToCompare.length === 2) {
          setTimeout(() => {
            if (
              state.cardsArr[state.photosToCompare[0] - 1].img ===
              state.cardsArr[state.photosToCompare[1] - 1].img
            ) {
              const newCardsArray = state.cardsArr.map((card) => {
                if (
                  card.id === state.photosToCompare[0] ||
                  card.id === state.photosToCompare[1]
                ) {
                  return { ...card, showImg: true };
                }
                return card;
              });
              return {
                ...state,
                cardsArr: newCardsArray,
              };
            } else {
              dispatch({
                type: "doubleChangeShowImgToFalse",
                payload: {
                  id1: state.photosToCompare[0],
                  id2: state.photosToCompare[1],
                },
              });
            }
          }, 400);
        } else {
          return {
            ...state,
            photosToCompare: [action.payload],
          };
        }
      default:
        return state;
    }
  }
  const shuffleRandomCards = () => {
    dispatch({ type: "shuffleRandom" });
    dispatch({ type: "hideAllImages" });
    dispatch({ type: "deletePhotoToPhotoCompare" });
  };

  const changeShowImg = (id) => {
    dispatch({ type: "changeShowImg", payload: id });
    dispatch({ type: "addPhotoToPhotoCompare", payload: id });
    dispatch({ type: "comparePhoto", payload: id });
    gameEndFunc();
  };

  function gameEndFunc() {
    let quantity = state.cardsArr.filter(
      (card) => card.showImg === true
    ).length;
    if (quantity === 11) {
      setGameEnd(true);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <h1>Memory Game</h1>
      {gameEnd ? <h2>YOU WIN</h2> : ""}
      <div className={styles.cardsContainer}>
        {state.cardsArr.map((card, index) => (
          <div
            key={index}
            className={styles.img}
            onClick={() => changeShowImg(card.id)}
          >
            {card.showImg ? (
              <img src={card.img} />
            ) : (
              <img className={styles.noActive} />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          shuffleRandomCards();
        }}
      >
        Restart
      </button>
    </div>
  );
};

export default MemoryGame;
