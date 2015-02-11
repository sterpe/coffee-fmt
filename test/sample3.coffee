class Car
  constructor: (@model) -> 

  drive: () ->
    alert "You are driving a " + this.model;

  delayed: () ->
    -> this.model
