
const proxy_redraw_on_change = ($target, $template, obj) => new Proxy(obj, {
  deleteProperty: function(target, property) {
    if($target[0] && $template[0]){
      $target.html(
        Handlebars.compile($template.html())(target)
      );
    }
    return true;
  },
  set: function(target, property, value, receiver) {      
    target[property] = value;
    if($target[0] && $template[0]){
      $target.html(
        Handlebars.compile($template.html())(target)
      );
    }
    return true;
  }
});

const proxy_save_to_local_storage = (name, obj) => new Proxy(obj, {
  deleteProperty: function(target, property) {
    window.localStorage.setItem(name, JSON.stringify(target));
    return true;
  },
  set: function(target, property, value, receiver) {      
    target[property] = value;
    window.localStorage.setItem(name, JSON.stringify(target));
    return true;
  }
  
});

var cart, catalogue, add_to_cart, remove_from_cart, purchase;

$(function(){
  
  cart = proxy_save_to_local_storage("cart",
    proxy_redraw_on_change(
      $(".cart-receiver"),
      $("#cart-template"),
      {}
    )
  );
  
  catalogue = proxy_redraw_on_change(
    $(".catalogue-receiver"),
    $("#catalogue-template"),
    {}
  );

  add_to_cart = function(id){
    console.log("Adding "+id+" to cart");
    if(!(id in cart.items)){
      cart.items[id] = catalogue[id];
      cart.items[id].count = 0;
      cart.items[id].total = 0;
    }
    cart.items[id].count = cart.items[id].count + 1;
    cart.items[id].total += catalogue[id].price;
    cart.count += 1;
    cart.total += catalogue[id].price;
  }

  remove_from_cart = function(id){
    console.log("Removing "+id+" from cart");
    if(id in cart.items){
      cart.items[id].count -= 1;
      cart.count -= 1;
      cart.total -= catalogue[id].price;
      cart.items[id].total -= catalogue[id].price;
      if(cart.items[id].count == 0 ){
        delete cart.items[id];
        cart.items = cart.items;
      }
    }
  }

  make_purchase = function(){
    $.ajax({
      url: "/app/api/purchase",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(cart.items),
      success: function(order, textstatus, jqXHR){
        alert("You successfully purchased "+order.count+" items for £"+order.total)
        initialise_cart()
      }
    });
  }

  initialise_cart = function(){
    // initialise cart
    cart.count = 0;
    cart.items = {};
    cart.total = 0;
  }

  $.get('/app/api/catalogue', 
    function(data){
      Object.assign(catalogue, data);
    },'json');

  var stored_cart = window.localStorage.getItem("cart");

  if(stored_cart){
    Object.assign(cart, JSON.parse(stored_cart));
  }else{
    initialise_cart();
  }

});
