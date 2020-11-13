/*
  Responsible for drawing and displaying the burger
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './BurgerIngredient.css';

/* TO DO:
Possibly add onions, chicken, salmon?, different cheese types as toppings
change meat to beef
*/

class BurgerIngredient extends Component {
  render() { 
    let ingredient = null;

    switch(this.props.type){
      case ('bread-bottom'):
        ingredient = <div className={classes.BreadBottom}/>
        break;
  
      case ('bread-top'):
        ingredient = <div className={classes.BreadTop}>
          <div className={classes.Seeds1}/>
          <div className={classes.Seeds2}/>
        </div>
        break;
  
      case ('meat'):
        ingredient = <div className={classes.Meat}/>
        break;
  
      case ('cheese'):
        ingredient = <div className={classes.Cheese}/>
        break;
  
      case ('lettuce'):
        ingredient = <div className={classes.Lettuce}/>
        break;
  
      case ('bacon'):
          ingredient = <div className={classes.Bacon}/>
          break;
      default:
        ingredient = null;
    }
  
    return ingredient;
  }
};

BurgerIngredient.propTypes = {
  type: PropTypes.string.isRequired
};

export default BurgerIngredient;