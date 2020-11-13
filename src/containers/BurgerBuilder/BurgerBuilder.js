/* 
  Manages the state for building burgers allowing to add items to burger and display the burger
*/

import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

/* 
  Possibly add presets
  Add more ingredient types
*/

const INGREDIENT_PRICES = {
  lettuce: 0.4,
  cheese: 0.5,
  meat: 2.0,
  bacon: 1.0
}

class BurgerBuilder extends Component{
  state = {
    ingredients: {
      lettuce: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    // Default price of burger with no added ingredients
    totalPrice: 4
  }

  addIngredientHandler = (type) => {
    // Add 1 to an ingredient 
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;

    // Update price
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    
    // Update state
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];

    // Empty case
    if(oldCount <= 0)
      return;

    // Subtract 1 from an ingredient
    const updatedCount = oldCount - 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updatedCount;

    // Update price
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    // Update state
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
  }

  render(){
    // Create copy of state and check to see which elements should be disabled
    const disabledInfo ={
      ...this.state.ingredients
    };
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    return (
      <Aux>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls 
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
        />
      </Aux>
    );
  }
};

export default BurgerBuilder;