/**
 * Created by yerui on 8/1/2016.
 */

/*array for holding product in shopping cart*/
var cart={
    "items":[]
};
/*total price of all the products in shopping cart*/
var total=0;
/*# of times of using promo code*/
var promoCount=0;

var shoppingCart=document.getElementById("cart");
var cartProduct=document.getElementById("cartProduct");
var showHide=document.getElementById("switcher");
var addButton=document.querySelectorAll(".addCart");
var totalPrice=shoppingCart.querySelector('.totalPrice');
var promoButton=shoppingCart.querySelector('#button-promo');


/*show and hide shopping cart*/
showHide.style.visibility="hidden";
shoppingCart.style.visibility="hidden";
showHide.addEventListener('click',function(){
        if (this.innerHTML === "Hide Shopping Cart") {
            this.innerHTML = "Show Shopping Cart";
            shoppingCart.style.visibility="hidden";
        } else {
            this.innerHTML = "Hide Shopping Cart";
            shoppingCart.style.visibility="visible";
        }

 });
/*add eventlistener to each "add to cart" button*/
for(var i=0;i<addButton.length;i++){
   addButton[i].addEventListener('click',addToCart,false);
}


function addToCart(e){
    var clickeditem=e.target.parentNode.id;
    addItem(clickeditem);
}

function addItem(e){
    var product=document.getElementById(e);
    var proName=product.querySelector(".name").innerHTML;
    var proDes=product.querySelector(".description").innerHTML;
    var proPrice=parseFloat(product.querySelector(".price span").innerHTML);
    var itemQuan=parseInt(product.querySelector(".inputQuan").value)||1;
    var hasID=-1;

    /*to determine whether this product is already in the shopping cart*/
    for(var i=0;i<cart.items.length;i++){
        if(cart.items[i].id===e)
            hasID=i;
    }

    /*if there's no such product in the shopping cart,add this product;else, increase the quantity property of that product*/
     if(cartProduct.childElementCount===0||hasID===-1){
        cart.items.push({
            "id":e,
            "name":proName,
            "Des":proDes,
            "Price":proPrice,
            "Quantity":itemQuan
        });

        shoppingCart.style.visibility="visible";
         showHide.style.visibility="visible";
     }
    else{
        cart.items[hasID].Quantity+=itemQuan;
    }
    appendHTML();

}
/*add shopping cart items into the page.*/
function appendHTML(){
    cartProduct.innerHTML="";
    total=0;

    for(var i=0;i<cart.items.length;i++) {
        var str='<li id="'+cart.items[i].id+i+'"><img src="http://placehold.it/350x150"><div class="proInfo"><h3 class="name">'+cart.items[i].name+'</h3><p class="description">'+cart.items[i].Des+'</p><p class="price">Price:$'+cart.items[i].Price+'</p><input id="'+cart.items[i].id+'" type="button"  class="remove" value="Remove"></div><input type="button" value="-" class="button-quan"><input  class="inputQuan"  value="'+cart.items[i].Quantity+'"><input class="button-quan" type="button" value="+"></li>';
        var newContent=document.createElement('div');
        newContent.innerHTML=str;
        /*add eventlistener to the remove button and change quantity button*/
        newContent.addEventListener('click',rmItem,false);
        newContent.addEventListener('click',updateQuan,false);
        total+=cart.items[i].Price*cart.items[i].Quantity;
        cartProduct.appendChild(newContent);
    }
    totalPrice.innerHTML=total;
}
function rmItem(e){
    var hasID=-1;
    for(var i=0;i<cart.items.length;i++){
        if(cart.items[i].id===e.target.id)
            hasID=i;
    }
    if(hasID!==-1){
        cart.items.splice(hasID,1);
    }
    appendHTML();
}

/*use '-' and '+' button to minus or add product quantity.*/
function updateQuan(e){
    /*get index of clicked product*/
    var index=cart.items.map(function(ele){return ele.id}).indexOf(e.target.parentNode.id.slice(0,e.target.parentNode.id.length-1));
    if(e.target.value==="-"){

            if(cart.items[index].Quantity>1){
                cart.items[index].Quantity-=1;
            }
    }else if(e.target.value==="+"){
        cart.items[index].Quantity+=1;
    }
}

/*apply promo code, once a promo code is used, the counter will increase 1,if the counter >2, the total price will be default price(without discount).
* this section has some problems, I will modify it in the future.*/
promoButton.addEventListener('click',function(e){
   var narniaArr=cart.items.filter(function(x){
       return x.name.indexOf("Narnia")!==-1;
   });
    var temp=total;
    if(cart.items.length>1) {
        if (e.target.previousSibling.value === "Discount5%") {
            total *= .95;
            promoCount++;
        }
        else if (narniaArr !== null && e.target.previousSibling.value === "Discount15%") {
            var nariaTotal = 0;
            for (var i = 0; i < narniaArr.length; i++) {
                nariaTotal += narniaArr[i].Price * narniaArr[i].Quantity;
            }
            total = total - nariaTotal + nariaTotal * .85;
            promoCount++;
        }
    }
    else {
        total*=.9;
        promoCount++;
    }

        if(promoCount>1){
           total=temp;
            totalPrice.innerHTML=total.toFixed(2);
        }
        else{
            e.target.previousSibling.value=null;
            totalPrice.innerHTML=total.toFixed(2);
        }


} );

