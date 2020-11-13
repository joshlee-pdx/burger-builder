import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
  // Converts the ingredients object into an array of ingredients
  // Extract keys of object and turn into an array (lettuce,bacon,cheese,meat,etc) but not values
  let transformedIngredients = Object.keys(props.ingredients) 
    .map(igKey => { // Turn array into array of arrays, and return burger ingredient for each element
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredient key={igKey+i} type={igKey} />;
      }); 
    })
    .reduce((arr,el) => { // Flatten array if no ingredients
      return arr.concat(el) // Add all empty elements to initial empty elements to flatten
    },[]);

  console.log(transformedIngredients);

  if(transformedIngredients.length === 0){
    transformedIngredients = <p> Please start adding ingredients!</p>
  }

  return(
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom"/>
    </div>
  );
};

export default burger;