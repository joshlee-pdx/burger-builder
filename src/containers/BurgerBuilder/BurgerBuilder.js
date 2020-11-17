/* 
  Manages the state for building burgers allowing to add items to burger and display the burger
*/

import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

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
    ingredients: null,  // Set to null because we're going to pull ingredients from firebase
    // Default price of burger with no added ingredients
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  // Load ingredients from database
  componentDidMount(){
    axios.get('https://reactburgerbuilder-cb5d3.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data})
      }).catch(error => {
        this.setState({error:true})
      });
  }

  updatePurchaseState(ingredients) {
    // Turn array of ingredients into an array of their values and add them together
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum,el) =>{
        return sum + el;
      },0);

    this.setState({purchasable: sum > 0});
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
    this.updatePurchaseState(updatedIngredients);
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
    this.updatePurchaseState(updatedIngredients);
  }

  // Activates purchasing state when user clicks to purchase their order
  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  // Disables purchasing state when user cancels their purchasing process
  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  // Activates the loading state and tries to post order to database when user confirms and places their order
  purchaseContinueHandler = () => {
    // alert('You continue!');

    this.setState({loading:true}); // Set state to loading until the transaction is complete

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, // For production - Would want to calculate price on server to make sure customers dont tamper with price
      customer: {
        name: ' josh lee',
        address: {
          street: 'teststreet 1',
          zipCode: '58673',
          country: 'USA'
        },
        email: 'testemail@test.com'
      },
      deliveryMethod: 'Fastest'
    }
    // Send post request to axios instance 
    axios.post('/orders.json',order) // For firebase, need to add .json for it to work correctly
      .then(response => {
        this.setState({loading:false, purchasing: false});  // Transaction completed, no longer loading
      })
      .catch(error => {
        this.setState({loading:false, purchasing: false});  // Transaction failed, error handling
      });
  }



  render(){
    // Create copy of state and check to see which elements should be disabled
    const disabledInfo ={
      ...this.state.ingredients
    };
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients cannot be loaded!</p>: <Spinner /> ;

    if(this.state.ingredients){
      burger= (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );

      // Load order summary if available, otherwise if still loading display the spinner
      orderSummary = <OrderSummary 
      ingredients={this.state.ingredients}
      price={this.state.totalPrice}
      purchaseCancel={this.purchaseCancelHandler}
      purchaseContinue={this.purchaseContinueHandler}
      />

      if(this.state.loading)
        orderSummary = <Spinner />
    }
      

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
};

export default withErrorHandler(BurgerBuilder, axios);