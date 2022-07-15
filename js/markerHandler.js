var shopId = null;

AFRAME.registerComponent('marker-handler',{
 init: async function(){
  if(shopId === null){
     this.askShopId()
  }

  var toys = await this.getToy()

  this.el.addEventListener('markerFound',() => {
   if(shopId !== null){
      var markerId = this.el.id
      this.handleMarkerFound(toys,markerId);
  
      this.el.addEventListener('markerLost',() => {
        this.handleMarkerLost();
      })
  }
})
 },
 askShopId: function(){
   var iconUrl = 'https://cdn2.iconfinder.com/data/icons/retail-business/50/ToyStore-512.png';
   swal({
     title: 'Welcome To Toy Store',
     icon: iconUrl,
     content:{
        element: 'input',
        attributes:{
         placeholder: 'Type a id, For example: u01',
         type: 'string',
        }
     },
     closeOnClickOutside: false,
   }).then(inputValue =>{
      shopId = inputValue;
   })

 },
 handleMarkerFound: function(toys,markerId){

   var toy = toys.filter(toy => toy.id === markerId)[0]

   var model = document.querySelector(`#model-${toy.id}`);
   model.setAttribute("position", toy.model_geometry.position);
   model.setAttribute("rotation", toy.model_geometry.rotation);
   model.setAttribute("scale", toy.model_geometry.scale);

   model.setAttribute('visible',true);

   var infoPlane = document.querySelector(`#main-plane-${toy.id}`)
   infoPlane.setAttribute('visible',true)

   var priceTag = document.querySelector(`#price-plane-${toy.id}`)
   priceTag.setAttribute('visible',true)

   var orderButton = document.getElementById('order-button');
   var summaryButton = document.getElementById('summary-button');
   var paymentButton = document.getElementById('pay-button');
   var ratingButton = document.getElementById('rating-button');

   orderButton.addEventListener('click',() => {

     swal({
        icon: 'success',
        title: 'Thanks For your order',
        text: 'Your order will be delivered soon',
        timer: 2000,
        buttons: false
     })
   })

   summaryButton.addEventListener('click',() => {
     this.handleOrderSummary();
   });

   paymentButton.addEventListener('click',() => {
     this.handlePayment();
   });

   ratingButton.addEventListener('click',() => {
    this.handleRating(toy)
   })
 },
 handleOrderSummary: function(){
  var sNumber;
  shopId <= 9 ? (sNumber = `T0${shopId}`) : `T${shopId}`;

  var modalDiv = document.getElementById("modal-div");
  modalDiv.style.display = "flex";

  
  var tableBodyTag = document.getElementById("bill-table-body");
  tableBodyTag.innerHTML = "";

  var tr = document.createElement("tr");

  
  var item = document.createElement("td");
  var price = document.createElement("td");
  var quantity = document.createElement("td");
  var subtotal = document.createElement("td");

 
  item.innerHTML = 'Crane Truck'

  price.innerHTML = "$" + 5
  price.setAttribute("class", "text-center");

  quantity.innerHTML = '2';
  quantity.setAttribute("class", "text-center");

  subtotal.innerHTML = "$" + 10
  subtotal.setAttribute("class", "text-center");

  
  tr.appendChild(item);
  tr.appendChild(price);
  tr.appendChild(quantity);
  tr.appendChild(subtotal);

  //Append row to the table
  tableBodyTag.appendChild(tr);


var totalTr = document.createElement('tr')
var td1 = document.createElement('td')
td1.setAttribute('class','no-line')

var td2 = document.createElement('td')
td1.setAttribute('class','no-line')

var td3 = document.createElememt('tr')
td1.setAttribute('class','no-line text-center')

var strongTag = document.createElement('strong');
strongTag.innerHTML = 'total'

td3.appendChild(strongTag)

var td4 = document.createElement('td')
td1.setAttribute('class','no-line text-center')
td4.innerHTML = $ordersummary.total_bill;

totalTr.appendChild(td1);
totalTr.appendChild(td2);
totalTr.appendChild(td3)
totalTr.appendChild(td4)

tableBodyTag.appendChild(totalTr)

 },
handleRating: function(toy){

  document.getElementById('rating-modal-div').style.display = 'flex';
  document.getElementyById('rating-input').value = '0';
 
  var saveRatingButton = document.getElementById('save-rating-button');
  saveRatingButton.addEventListener('click',() => {
    document.getElementById('rating-modal-div').style.display = 'none';

    var rating = document.getElementById('rating-input').value;

    firebase
    .firestore()
    .collection(toys)
    .doc(toy.id)
    .update({
      rating: rating
    })
    .then(() => {
       swal({
        icon: 'success',
        title: 'Thanks for Rating !',
        text: 'Hope You Liked The Toy !!',
        timer: 2500,
        buttons: false
       })
    })


  })

},
 getToy: async function(){
   return await firebase
    .firestore()
    .collections('toys')
    .get()
    .then(snap => {
      return snap.docs.map(doc => doc.data)
    })
 },
 handlePayment: function () {
  
  document.getElementById('modal-div').style.display='none';
      
  swal({
    icon: 'success',
    title: 'PAYMENT SUCCESSFULL',
    text: 'HOPE YOU LIKED OUR PRODUCT',
    timer: 2500,
    buttons: false
  })

 },
 handleMarkerLost: function(){
  var buttonDiv = document.getElementById('button-div');
  buttonDiv.style.display = none;
 }
})